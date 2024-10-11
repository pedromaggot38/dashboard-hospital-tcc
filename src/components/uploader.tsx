'use client'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import { Button } from './ui/button';
import Tus from '@uppy/tus';

interface UploaderProps {
    slug: string;
}

export default function Uploader({ slug }: UploaderProps) {
    const [uppy] = useState(() => new Uppy(
        {
            restrictions: {
                maxNumberOfFiles: 1,
                allowedFileTypes: ['image/*'],
                maxFileSize: 5 * 1024 * 1024,
            }
        }).use(Tus, {
            endpoint:`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
            },
            allowedMetaFields: [
                "bucketName",
                "objectName",
                "contentType",
                "cacheControl",
            ]
        })
    );

    const onBeforeRequest = async (req: any) => {

    }

    uppy.on("file-added", (file) => {
        file.meta = {
            ...file.meta,
            bucketName: "articles-images",
            contentType: file.type,
        }
    })

    const handleUpload = () => {
        uppy.setFileMeta(uppy.getFiles()[0].id, {
            objectName: `${slug}/${uppy.getFiles()[0].name}`
        })
        uppy.upload();
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Definir Capa do Artigo</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Selecionar Imagem</DialogTitle>
                    <DialogDescription>
                        Por favor, escolha uma imagem que represente bem o conteúdo.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Dashboard
                        uppy={uppy}
                        hideUploadButton
                    />
                </div>
                <div className='mt-4 flex justify-end'>
                    <Button onClick={handleUpload}>Definir Capa do Artigo</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}