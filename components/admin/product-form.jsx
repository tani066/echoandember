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
    const [selectedCategories, setSelectedCategories] = useState(product?.categories || (product?.category ? [product.category] : []))

    // Files State
    const [imageFiles, setImageFiles] = useState([]) // For new uploads
    const [videoFiles, setVideoFiles] = useState([]) // For new uploads
    const [existingImages, setExistingImages] = useState(product?.images || [])
    const [existingVideos, setExistingVideos] = useState(product?.videos || [])

    // Options State
    // Options State
    const [options, setOptions] = useState(() => {
        if (!product?.options) return []
        const parsed = JSON.parse(JSON.stringify(product.options))
        // Normalize values to objects if they are strings (backward compatibility)
        return parsed.map(opt => ({
            ...opt,
            values: opt.values.map(v => typeof v === 'string' ? { label: v, price: 0, inStock: true } : { ...v, inStock: v.inStock !== false })
        }))
    })

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

    const handleAddValue = (optIndex) => {
        const newOptions = [...options]
        newOptions[optIndex].values.push({ label: "", price: 0, inStock: true })
        setOptions(newOptions)
    }

    const handleRemoveValue = (optIndex, valIndex) => {
        const newOptions = [...options]
        newOptions[optIndex].values.splice(valIndex, 1)
        setOptions(newOptions)
    }

    const handleValueChange = (optIndex, valIndex, field, value) => {
        const newOptions = [...options]
        newOptions[optIndex].values[valIndex][field] = value
        setOptions(newOptions)
    }

    async function onSubmit(event) {
        event.preventDefault()
        if (selectedCategories.length === 0) {
            toast.error("Please select at least one category")
            return
        }
        setLoading(true)

        const formData = new FormData(event.currentTarget)

        try {
            // Add Categories
            formData.append("categories", JSON.stringify(selectedCategories))
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
                                <Label>Categories</Label>
                                <div className="grid grid-cols-2 gap-2 p-4 border rounded-md max-h-[200px] overflow-y-auto">
                                    {CATEGORIES.map((cat) => (
                                        <div key={cat.name} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={`cat-${cat.name}`}
                                                value={cat.name}
                                                checked={selectedCategories.includes(cat.name)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedCategories([...selectedCategories, cat.name])
                                                    } else {
                                                        setSelectedCategories(selectedCategories.filter(c => c !== cat.name))
                                                    }
                                                }}
                                                className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                            />
                                            <label htmlFor={`cat-${cat.name}`} className="text-sm cursor-pointer select-none">
                                                {cat.name} {cat.emoji}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {selectedCategories.length === 0 && <p className="text-xs text-red-500">Please select at least one category.</p>}
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
                                <div key={index} className="p-4 bg-slate-50 rounded-lg border space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="w-1/2">
                                            <Label className="text-xs text-muted-foreground mb-1 block">Option Name</Label>
                                            <Input
                                                placeholder="e.g. Size, Color, Material"
                                                value={opt.name}
                                                onChange={(e) => handleOptionNameChange(index, e.target.value)}
                                            />
                                        </div>
                                        <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveOption(index)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Values</Label>
                                        {opt.values.map((val, vIndex) => (
                                            <div key={vIndex} className="flex gap-2 items-center">
                                                <Input
                                                    placeholder="Label (e.g. Small)"
                                                    className="flex-1"
                                                    value={val.label}
                                                    onChange={(e) => handleValueChange(index, vIndex, 'label', e.target.value)}
                                                />
                                                <div className="relative w-24">
                                                    <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">$</span>
                                                    <Input
                                                        type="number"
                                                        placeholder="Override"
                                                        className="pl-6"
                                                        value={val.price || ''}
                                                        onChange={(e) => handleValueChange(index, vIndex, 'price', parseFloat(e.target.value) || 0)}
                                                    />
                                                </div>

                                                {/* In Stock Toggle */}
                                                <div className="flex items-center gap-1.5 border px-2 py-2 rounded-md bg-white">
                                                    <input
                                                        type="checkbox"
                                                        id={`stock-${index}-${vIndex}`}
                                                        checked={val.inStock !== false} // Default true
                                                        onChange={(e) => handleValueChange(index, vIndex, 'inStock', e.target.checked)}
                                                        className="w-4 h-4 accent-primary cursor-pointer"
                                                    />
                                                    <label htmlFor={`stock-${index}-${vIndex}`} className="text-xs cursor-pointer select-none font-medium text-slate-600">
                                                        {val.inStock === false ? 'Out' : 'In Stock'}
                                                    </label>
                                                </div>

                                                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveValue(index, vIndex)} className="text-muted-foreground hover:text-red-500">
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button type="button" variant="outline" size="sm" onClick={() => handleAddValue(index)} className="text-xs">
                                            <Plus className="w-3 h-3 mr-1" /> Add Value
                                        </Button>
                                    </div>
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