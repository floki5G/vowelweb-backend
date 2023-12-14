import { Request, Response } from 'express';
// import db from '../../database/db';
import BadRequest from '../errors/BadRequest';
import { IResponseErrorObject } from '../errors';
import errorHandleManager from '../errors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
// ? get all items from the data.json file
const getallJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data.json')).toString());
let data = getallJson;
// ? controller to write items to the data.json file
const writeData = (data: {
    name: string;
    price: number;
    description: string;
    category: string;
    id: string;
}[]) => {
    fs.writeFileSync(path.join(__dirname, '../../data.json'), JSON.stringify(data));
}

export const getAllItems = async (req: Request, res: Response) => {

    try {
        const { type, offset } = req.params as unknown as {
            type: string;
            offset: number;
        }
        let new_offset = 1;
        // ? check if offset is a number
        if (offset) {
            new_offset = Number(offset);
        }

        // ? get all items from the database
        const all = data
        
        // ? filter items by type
        if (type) {
            let filtered
            if (type !== 'all' && type !=='descending' && type !=='ascending') {
                filtered = all.filter((item: any) => item.category === type);
            }else if(type === 'ascending'){
                filtered = all.sort((a:any,b:any)=>a.price-b.price)
            }
            else if(type === 'descending'){
                filtered = all.sort((a:any,b:any)=>b.price-a.price)
            }
            
            else{
                filtered = all;
            }

            // ? sort items by offset
            filtered = filtered.slice((offset * 10) - 10, (offset * 10) + 10);

            // ? check if offset is greater than the number of items in the database
            if (filtered.length === 0) {
                throw new BadRequest({
                    message: "Offset is greater than the number of items in the database try a lower offset preferably 1",
                });
            }
            return res.status(200).json({
                status: "success",
                message: `All ${type} items by page ${offset}`,
                data: filtered,
            });
        }


        return res.status(200).json({
            status: "success",
            message: "All items",
            data: all,
        });
    } catch (err) {
        const error = err as IResponseErrorObject;
        return errorHandleManager(error, res);
    }
}




// ? controller to post items
export const postItems = async (req: Request, res: Response) => {
    try {
        const { name, price, description, category } = req.body;
        if (!name || !price || !description || !category) {
            return new BadRequest({
                message: 'All fields are required',
                code: '400'
            });

        }
        // ? generate a random uuid
        const id = uuidv4();
        const item = data.push({ name, price, description, category, id })
        // ? write items to the data.json file
        writeData(data)
        return res.status(200).json({
            status: "success",
            message: "Item added successfully",
            data: item,
        });
    }

    catch (err) {
        const error = err as IResponseErrorObject;
        return errorHandleManager(error, res);

    }
}

// ? controller to delete items
export const deleteItems = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // ? check if id exist in the database
        const checkId = data.filter((item:any)=>item.id === id)
        // await db.query('SELECT * FROM omin_solution WHERE id = ?', [id]);
        if (!checkId.length) {
            throw new BadRequest({
                message: "Id does not exist",
            });
        }
        const item = data.filter((item:any)=>item.id !== id)
        writeData(item)

        return res.status(200).json({
            status: "success",
            message: "Item deleted successfully",
            data: item,
        });
    }
    catch (err) {
        const error = err as IResponseErrorObject;
        return errorHandleManager(error, res);
    }
}
// ? controller to get items by id
export const getItemsById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const item =  data.filter((item:any)=>item.id === id)
        // ? check if id exist in the database
        if (!item.length) {
            throw new BadRequest({
                message: "Id does not exist",
            });
        }
        return res.status(200).json({
            status: "success",
            message: "Item retrieved successfully",
            data: item,
        });
    }

    catch (err) {
        const error = err as IResponseErrorObject;
        return errorHandleManager(error, res);

    }
}
// ? controller to update items
export const updateItems = async (req: Request, res: Response) => {
    try {
        const { name, price, description, category, id } = req.body;
        // ? check if id exist in the database
        if (!id) {
            return new BadRequest({
                message: 'All fields are required',
            });
        }
        const checkId =  data.filter((item:any)=>item.id === id)
        if (!checkId.length) {
            throw new BadRequest({
                message: "Id does not exist",
            });

        }

        if (!name || !price || !description || !category) {
            throw new BadRequest({
                message: 'All fields are required',
            });

        }

        const item = data.map((item:any)=>{
            if(item.id === id){
                item.name = name;
                item.price = price;
                item.description = description;
                item.category = category;
            }
            return item
        })
        writeData(item)
        return res.status(200).json({
            status: "success",
            message: "Item updated successfully",
            data: item,
        });
    }

    catch (err) {
        const error = err as IResponseErrorObject;
        return errorHandleManager(error, res);

    }
}