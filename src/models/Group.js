import { Schema, SchemaTypes, model } from "mongoose";

const groupSchema = new Schema({
    groupName: {
        type: SchemaTypes.String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: SchemaTypes.String,
        required: true
    },
    anchorIds: {
        type: [SchemaTypes.String]
    }
});

const Group = model('group', groupSchema);

export default Group;