import { Separator } from "@/components/ui/separator"
import { OrganizationForm } from "./organization-form"
export default function OrganizationSettingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Organization</h3>
        <p className="text-sm text-muted-foreground">
          Update your organization settings. Set your preferred language and
          timezone.
        </p>
      </div>
      <Separator />
      <OrganizationForm/>
    </div>
  )
}