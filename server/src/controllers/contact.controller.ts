import { Request, Response } from "express";
import { createContactSchema, updateContactSchema } from "../validators/contact.validator.js";
import { createContact, deleteContact, getContacts, updateContact } from "../services/contact.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { importContactsFromCSV } from "../services/contact.service.js";
import { getContactById } from "../services/contact.service.js";

export const create = asyncHandler( async (req: Request, res: Response) => {
        
    const parsed = createContactSchema.parse(req.body);
        const contact = await createContact( req.user!.id, parsed );

        res.status(201).json({
            success: true,
            message: "Contact created successfully",
            data: contact,
        });

    }
);

export const getAll = asyncHandler( async (req: Request, res: Response) => {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search as string | undefined;
        const result = await getContacts( req.user!.id, page, limit, search );
        res.json({ success: true, data: result, });
    }
);

export const update = asyncHandler ( async (req: Request, res: Response) => {

        const parsed = updateContactSchema.parse( req.body );
        
        const contactId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const contact = await updateContact(req.user!.id, contactId, parsed);

        res.json({
            success:true,
            message:"Contact updated successfully",
            data:contact,
        });
    }
);

export const remove = asyncHandler( async (req: Request, res: Response) => {
     
    const contactId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await deleteContact(req.user!.id, contactId);

        res.json({
            success: true,
            message: "Contact deleted successfully",
        });
    }
);

export const importContacts = asyncHandler( async ( req: Request, res: Response ) => {

    if(!req.file){
        throw new Error("CSV file is required");
    }

    const result = await importContactsFromCSV(
        req.user!.id,
        req.file.buffer
    );

    res.json({
        success:true,
        message:"Import completed",
        data:result,
    });
});

export const getOne = asyncHandler(

    async (req, res) => {

        const contactId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;

        const contact = await getContactById(

            req.user!.id,

            contactId

        );

        res.json({

            success: true,

            data: contact,

        });

    }

);