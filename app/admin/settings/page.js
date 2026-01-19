"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { getSiteSettings, updateSiteSettings } from "@/app/actions"
import { Settings, Save } from "lucide-react"

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [settings, setSettings] = useState(null)

    useEffect(() => {
        getSiteSettings().then(setSettings)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const formData = new FormData(e.target)
            await updateSiteSettings(formData)
            toast.success("Settings updated successfully! ⚙️")
        } catch (error) {
            toast.error("Failed to update settings")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    if (!settings) return <div className="p-8">Loading settings...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Settings className="w-8 h-8" /> Settings
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Information</CardTitle>
                            <CardDescription>Basic store details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="storeName">Store Name</Label>
                                <Input id="storeName" name="storeName" defaultValue={settings.storeName} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="supportEmail">Support Email</Label>
                                <Input id="supportEmail" name="supportEmail" type="email" defaultValue={settings.supportEmail || ""} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Announcement Bar</CardTitle>
                            <CardDescription>Top banner text visibility.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="announcementText">Banner Text</Label>
                                <Input id="announcementText" name="announcementText" defaultValue={settings.announcementText} />
                                <p className="text-xs text-muted-foreground">Use emojis for flair! ✨</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Rules</CardTitle>
                            <CardDescription>Configure global shipping costs.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="shippingCost">Standard Shipping Cost (₹)</Label>
                                <Input id="shippingCost" name="shippingCost" type="number" min="0" defaultValue={settings.shippingCost} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (₹)</Label>
                                <Input id="freeShippingThreshold" name="freeShippingThreshold" type="number" min="0" defaultValue={settings.freeShippingThreshold} required />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>System Status</CardTitle>
                            <CardDescription>Control store availability.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Maintenance Mode</Label>
                                    <p className="text-sm text-muted-foreground">Disable store access for customers.</p>
                                </div>
                                <Switch name="maintenanceMode" defaultChecked={settings.maintenanceMode} disabled />
                            </div>
                            <p className="text-xs text-red-500 font-medium">To be enabled in future update.</p>
                        </CardContent>
                    </Card>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                    </Button>
                </div>
            </form>
        </div>
    )
}
