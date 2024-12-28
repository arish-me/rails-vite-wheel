"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Camera } from "lucide-react"; // Ensure you have the correct import for your icon
import { toast } from "sonner";

interface ImageUploaderProps {
  acceptedFormats?: { [key: string]: any };
  maxSize?: number; // in bytes
  data?: any; // existing data for the entity (e.g., organization)
  api?: (id: string, data: FormData) => Promise<any>;
  onUploadSuccess?: (imageUrl: string) => void; // New callback prop
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  acceptedFormats = { "image/png": [], "image/jpg": [], "image/jpeg": [] },
  maxSize = 1000000,
  api,
  data,
  onUploadSuccess,
}) => {
  const [preview, setPreview] = React.useState(data?.image_url);

  const formSchema = z.object({
    image: z
      .instanceof(File)
      .refine((file) => file.size !== 0, "Please upload an image"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      image: new File([""], "filename"),
    },
  });

  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setPreview(URL.createObjectURL(acceptedFiles[0]));
        await uploadImage(acceptedFiles[0]);
      } catch (error) {
        console.warn(error);
        setPreview(null);
        form.resetField("image");
      }
    },
    [form]
  );

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize,
    accept: acceptedFormats,
  });

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api(data.id, formData);
      const uploadedImageUrl = response.data.image_url;

      toast.success(`${response.data.notice} 🎉`);

      // Trigger the callback with the new image URL
      if (onUploadSuccess) {
        onUploadSuccess(uploadedImageUrl);
      }
    } catch (error) {
      toast.error(`Error uploading image: ${error.message}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => console.log(values))} className="space-y-4">
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem className="mx-auto">
              <FormLabel
                className={`${
                  fileRejections.length !== 0 && "text-destructive"
                }`}
              >
                <h2 className="text-xl font-semibold tracking-tight"></h2>
              </FormLabel>
              <FormControl>
                <div
                  {...getRootProps()}
                  className="relative mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2"
                >
                  <Avatar className="relative rounded-circle h-24 w-24 sm:h-32 sm:w-32 ring-4 ring-white object-cover rounded-full bg-gray-500 hover:bg-gray-500 group">
                    <AvatarImage
                      src={preview as string}
                      alt="Uploaded image"
                      className="rounded-full object-cover border"
                    />
                    <AvatarFallback className="relative rounded-circle h-24 w-24 sm:h-32 sm:w-32 ring-4 ring-white object-cover rounded-full bg-gray-300 hover:bg-gray-500 group">
                      <Camera className="absolute top-1/2 left-1/2 h-10 w-10 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" aria-hidden="true" />
                    </AvatarFallback>
                  </Avatar>
                  <Input {...getInputProps()} type="file" className="hidden" />
                </div>
              </FormControl>
              <FormMessage>
                {fileRejections.length !== 0 && (
                  <p>
                    Image must be less than {maxSize / 1000000}MB and of type png, jpg, or jpeg.
                  </p>
                )}
              </FormMessage>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
