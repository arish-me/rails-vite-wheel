import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {ImageUploader} from "@/components/image-uploader"

import { Icons } from "@/components/icons";
import { fetch, create, upload } from '@/apis/profilesApi';

export function ProfileForm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState({});
  const [profile, setProfile] = useState(null);
  const [genders, setGenders] = useState({});
  const profileFormSchema = z.object({
    first_name: z
      .string()
      .min(2, { message: "First Name must be at least 2 characters." })
      .max(30, { message: "First Name must not be longer than 30 characters." }),
    middle_name: z
      .string()
      .max(30, { message: "Middle Name must not be longer than 30 characters." })
      .optional(),
    last_name: z
      .string()
      .min(2, { message: "Last Name must be at least 2 characters." })
      .max(30, { message: "Last Name must not be longer than 30 characters." }),
    bio: z.string().max(160).min(4),
    gender: z.string({ required_error: "Please select pronouns to display." }),
  });

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch();
      const responseProfile = response.data.profile
      setProfile(responseProfile);
      setGenders(response.data.genders);
      console.log(profile)
      // Update form values after profile is fetched
      form.reset({
        first_name: responseProfile?.first_name ?? "",
        last_name: responseProfile?.last_name ?? "",
        middle_name: responseProfile?.middle_name ?? "",
        bio: responseProfile?.bio ?? "",
        gender: responseProfile?.gender ?? "",
      });
    } catch (error) {
      console.warn(error)
      toast.error('Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  async  function onSubmit (data) {
    setIsProcessing(true);
    try {
      const response = await create(data);
      const { notice } = response.data;
      toast.success(notice);
    } catch (err) {
      const { errors } = err.response.data;
      toast.error(errors);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ImageUploader
            labelText="Upload Profile Picture"
            submitButtonText="Save Picture"
            acceptedFormats={{ "image/png": [], "image/jpeg": [] }}
            maxSize={2000000}
            data={profile}
            api={upload}
          />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="middle_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Middle Name (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="-----Select-----" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(genders).map(([key]) => (
                          <SelectItem key={key} value={String(key)}>
                            {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isProcessing}>
                {isProcessing && (
                  <Icons.spinner
                    className="mr-2 size-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Update Profile
              </Button>
            </form>
          </Form>
        </>
      )}
    </>
  );
}
