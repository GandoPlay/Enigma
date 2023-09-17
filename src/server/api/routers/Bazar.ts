import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const BazarRouter = createTRPCRouter({
  addBazar: publicProcedure
    .input(z.object({ date: z.number(), name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const name = input.name.replace(" ", "-");
        const bazar = await ctx.db.bazar.create({
          data: {
            date: input.date,
            name,
          },
        });
        return {
          data: bazar,
          message: "באזר נוסף",
        };
      } catch (error: any) {
        if (error.code === "P2002") {
          return {
            data: undefined,
            message: "קיים באזר עם שם זהה",
          };
        } else {
          return {
            data: undefined,
            message: "שגיאה",
          };
        }
      }
    }),

  deleteBazar: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.db.bazar.delete({
          where: {
            id: input.id,
          },
        });
        return {
          data: undefined,
          message: "באזר נמחק",
        };
      } catch (error: any) {}
      return {
        data: undefined,
        message: "שגיאה",
      };
    }),

  addPerson: publicProcedure
    .input(
      z.object({
        bazarName: z.string(),
        personName: z.string(),
        personPhone: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const person = await ctx.db.person.create({
          data: {
            name: input.personName,
            phoneNumber: input.personPhone,
          },
        });
        const bazar = await ctx.db.bazar.update({
          where: {
            name: input.bazarName,
          },
          data: {
            person: {
              connect: {
                ...person,
              },
            },
          },
        });
        return {
          data: bazar,
          message: "באזר עודכן",
        };
      } catch (error: any) {
        console.log(error);

        return {
          data: undefined,
          message: "שגיאה",
        };
      }
    }),
  getAllBazars: publicProcedure.query(async ({ ctx }) => {
    try {
      const bazars = await ctx.db.bazar.findMany({
        include: {
          person: true,
        },
      });
      const res = bazars.map((bazar) => {
        return {
          id: bazar.id,
          name: bazar.name,
          date: bazar.date,
          count: bazar.person ? bazar.person.length : 0,
        };
      });
      return res;
    } catch (error: any) {
      return undefined;
    }
  }),
});
