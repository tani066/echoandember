"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Save, Plus, X, Upload, Video, Trash2 } from "lucide-react"
import Image from "next/image"
import { addProduct, updateProduct } from "@/app/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { CATEGORIES } from "@/lib/constants"

export function ProductForm({ product }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // Files State
    const [imageFiles, setImageFiles] = useState([]) // For new uploads
    const [videoFiles, setVideoFiles] = useState([]) // For new uploads
    const [existingImages, setExistingImages] = useState(product?.images || [])
    const [existingVideos, setExistingVideos] = useState(product?.videos || [])

    // Options State
    const [options, setOptions] = useState(product?.options ? JSON.parse(JSON.stringify(product.options)) : [])

    // Handlers for Files
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        const validFiles = []

        files.forEach(file => {
            if (file.size > 5 * 1024 * 1024) { // 5MB
                toast.error(`File ${file.name} is too large (Max 5MB)`)
            } else {
                validFiles.push(file)
            }
        })

        const newPreviews = validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }))
        setImageFiles([...imageFiles, ...newPreviews])
    }

    const handleVideoChange = (e) => {
        const files = Array.from(e.target.files)
        const validFiles = []

        files.forEach(file => {
            if (file.size > 50 * 1024 * 1024) { // 50MB
                toast.error(`File ${file.name} is too large (Max 50MB)`)
            } else {
                validFiles.push(file)
            }
        })

        const newPreviews = validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }))
        setVideoFiles([...videoFiles, ...newPreviews])
    }

    const removeNewFile = (index, type) => {
        if (type === 'image') {
            const newFiles = [...imageFiles]
            URL.revokeObjectURL(newFiles[index].preview) // Clean up memory
            newFiles.splice(index, 1)
            setImageFiles(newFiles)
        } else {
            const newFiles = [...videoFiles]
            URL.revokeObjectURL(newFiles[index].preview)
            newFiles.splice(index, 1)
            setVideoFiles(newFiles)
        }
    }

    const removeExistingFile = (index, type) => {
        if (type === 'image') {
            setExistingImages(existingImages.filter((_, i) => i !== index))
        } else {
            setExistingVideos(existingVideos.filter((_, i) => i !== index))
        }
    }

    // Handlers for Options
    const handleAddOption = () => setOptions([...options, { name: "", values: [] }])
    const handleRemoveOption = (index) => setOptions(options.filter((_, i) => i !== index))
    const handleOptionNameChange = (index, name) => {
        const newOptions = [...options]; newOptions[index].name = name; setOptions(newOptions)
    }
    const handleOptionValuesChange = (index, valuesString) => {
        const newOptions = [...options]
        newOptions[index].values = valuesString.split(",").map(v => v.trim()).filter(Boolean)
        setOptions(newOptions)
    }

    async function onSubmit(event) {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)

        try {
            // Add Options
            formData.set("options", JSON.stringify(options))

            // Add existing files (that weren't deleted)
            formData.append("existingImages", JSON.stringify(existingImages))
            formData.append("existingVideos", JSON.stringify(existingVideos))

            // Add new files
            imageFiles.forEach(item => formData.append("images", item.file))
            videoFiles.forEach(item => formData.append("videos", item.file))

            if (product) {
                await updateProduct(product.id, formData)
                toast.success("Product updated successfully")
            } else {
                await addProduct(formData)
                toast.success("Product created successfully")
            }
            router.push("/admin/products")
        } catch (error) {
            console.error("Submit Error:", error)
            toast.error(error.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                    {/* Basic Info Card */}
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" defaultValue={product?.title} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" defaultValue={product?.description} required className="min-h-[120px]" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price ($)</Label>
                                    <Input id="price" name="price" type="number" step="0.01" defaultValue={product?.price} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock</Label>
                                    <Input id="stock" name="stock" type="number" defaultValue={product?.stock} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <select
                                    id="category"
                                    name="category"
                                    defaultValue={product?.category}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat.name} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Options Card */}
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-base">Product Options</Label>
                                <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
                                    <Plus className="w-4 h-4 mr-2" /> Add Option
                                </Button>
                            </div>
                            {options.map((opt, index) => (
                                <div key={index} className="flex gap-2 items-start p-3 bg-slate-50 rounded-lg border">
                                    <div className="flex-1 space-y-2">
                                        <Input placeholder="Option Name" value={opt.name} onChange={(e) => handleOptionNameChange(index, e.target.value)} />
                                        <Input placeholder="Values (S, M, L)" value={opt.values.join(", ")} onChange={(e) => handleOptionValuesChange(index, e.target.value)} />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveOption(index)} className="text-red-500">
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Media Upload Card */}
                    <Card>
                        <CardContent className="pt-6 space-y-6">
                            {/* Images Section */}
                            <div className="space-y-2">
                                <Label>Images</Label>
                                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center relative hover:bg-slate-50">
                                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                    <p className="text-sm">Upload Images</p>
                                    <Input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                                </div>

                                <div className="grid grid-cols-3 gap-2 mt-4">
                                    {/* Previews of existing images */}
                                    {existingImages.map((img, i) => (
                                        <div key={`exist-${i}`} className="relative aspect-square rounded-md overflow-hidden border group">
                                            <Image src={img} alt="Product" fill className="object-cover" />
                                            <button type="button" onClick={() => removeExistingFile(i, 'image')} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {/* Previews of new images */}
                                    {imageFiles.map((img, i) => (
                                        <div key={`new-${i}`} className="relative aspect-square rounded-md overflow-hidden border group ring-2 ring-blue-500">
                                            <Image src={img.preview} alt="New" fill className="object-cover" />
                                            <button type="button" onClick={() => removeNewFile(i, 'image')} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Videos Section */}
                            <div className="space-y-2">
                                <Label>Videos</Label>
                                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center relative hover:bg-slate-50">
                                    <Video className="w-8 h-8 text-muted-foreground mb-2" />
                                    <p className="text-sm">Upload Videos</p>
                                    <Input type="file" multiple accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleVideoChange} />
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    {existingVideos.map((vid, i) => (
                                        <div key={`v-exist-${i}`} className="relative group">
                                            <video src={vid} className="w-full rounded-md border bg-black h-32" />
                                            <button type="button" onClick={() => removeExistingFile(i, 'video')} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {videoFiles.map((vid, i) => (
                                        <div key={`v-new-${i}`} className="relative ring-2 ring-blue-500 rounded-md overflow-hidden">
                                            <video src={vid.preview} className="w-full h-32 border bg-black" />
                                            <button type="button" onClick={() => removeNewFile(i, 'video')} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading} className="min-w-[150px]">
                    {loading ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Product</>}
                </Button>
            </div>
        </form>
    )
}