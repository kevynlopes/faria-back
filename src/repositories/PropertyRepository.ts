import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default {
  async findAll() {
    return prisma.property.findMany({
      include: { images: true },
    });
  },

  async create(
    data: Omit<Prisma.PropertyCreateInput, "user"> & { userId: string }
  ) {
    const { userId, ...propertyData } = data;

    return prisma.property.create({
      data: {
        ...propertyData,
        user: {
          connect: { id: userId },
        },
      },
    });
  },

  async createImage({
    url,
    public_id,
    propertyId,
  }: {
    url: string;
    public_id?: string; // opcional se você ainda estiver usando public_id como opcional no Prisma
    propertyId: string;
  }) {
    return prisma.image.create({
      data: {
        url,
        public_id,
        propertyId,
      },
    });
  },
};
