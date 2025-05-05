import { Request, Response } from "express";
import { uploadToCloudinary } from "../utils/cloudinary";
import { prisma } from "../lib/prisma";
import { v2 as cloudinary } from "cloudinary";

export const ImageController = {
  async addImage(req: Request, res: Response) {
    const { propertyId } = req.params;
    const files = req.files as Express.Multer.File[];

    try {
      const uploaded = await Promise.all(
        files.map((file) => uploadToCloudinary(file))
      );

      const images = await Promise.all(
        uploaded.map(({ url, public_id }) =>
          prisma.image.create({
            data: { url, public_id, propertyId },
          })
        )
      );

      res.status(201).json(images);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao adicionar imagem" });
    }
  },

  async deleteImage(req: Request, res: Response) {
    const { imageId } = req.params;

    try {
      // Busca a imagem antes de deletar
      const image = await prisma.image.findUnique({
        where: { id: imageId },
      });

      if (!image) {
        return res.status(404).json({ message: "Imagem não encontrada" });
      }

      // Remove do Cloudinary
      await cloudinary.uploader.destroy(image.public_id);

      // Remove do banco
      await prisma.image.delete({
        where: { id: imageId },
      });

      res.status(200).json({ message: "Imagem removida com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao remover imagem" });
    }
  },
};
