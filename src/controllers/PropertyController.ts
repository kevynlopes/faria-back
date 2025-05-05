import { Request, Response } from "express";
import PropertyRepository from "../repositories/PropertyRepository";
import { uploadToCloudinary } from "../utils/cloudinary";

export const PropertyController = {
  async index(request: Request, response: Response) {
    const properties = await PropertyRepository.findAll();
    return response.json(properties);
  },

  async show(request: Request, response: Response) {
    // todo
  },

  async store(request: Request, response: Response) {
    const {
      title,
      description,
      price,
      type,
      listingType,
      location,
      city,
      country,
      address,
      bedrooms,
      bathrooms,
      area,
      features,
      isFeatured,
      isNew,
    } = request.body;

    const userId = (request as any).user?.id;

    if (!userId) {
      return response.status(401).json({ error: "Usuário não autenticado" });
    }

    const files = request.files as Express.Multer.File[];

    try {
      // Corrige 'features' para garantir que seja sempre um array de strings
      const parsedFeatures = Array.isArray(features)
        ? features
        : typeof features === "string"
        ? features
            .replace(/^"|"$/g, "")
            .split(",")
            .map((f) => f.trim())
        : [];

      const property = await PropertyRepository.create({
        title,
        description,
        price: Number(price),
        type,
        listingType,
        location,
        city,
        country,
        address,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        area: Number(area),
        features: parsedFeatures,
        isFeatured: Boolean(isFeatured),
        isNew: Boolean(isNew),
        userId,
      });

      const uploadedUrls = files?.length
        ? await Promise.all(files.map((file) => uploadToCloudinary(file)))
        : [];

      if (uploadedUrls.length > 0) {
        await Promise.all(
          uploadedUrls.map(({ url, public_id }) =>
            PropertyRepository.createImage({
              url,
              public_id,
              propertyId: property.id,
            })
          )
        );
      }

      return response.status(201).json({
        property,
        images: uploadedUrls,
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: "Erro ao criar imóvel" });
    }
  },

  async update(request: Request, response: Response) {
    // todo
  },

  async delete(request: Request, response: Response) {
    // todo
  },
};
