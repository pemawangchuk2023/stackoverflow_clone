import { IUserDoc } from "@/database/user.model";
import { model, models, Schema, Document, Types } from "mongoose";

export interface IMessage {
	sender: Types.ObjectId | IUserDoc;
	content: string;
	role: "user" | "assistant" | "system";
	timestamp: Date;
}

export interface IChat {
	participants: Types.ObjectId[];
	messages: IMessage[];
	title?: string;
}

export interface IChatDoc extends IChat, Document {}

const MessageSchema = new Schema<IMessage>(
	{
		sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
		content: { type: String, required: true },
		role: {
			type: String,
			enum: ["user", "assistant", "system"],
			default: "user",
		},
		timestamp: { type: Date, default: Date.now },
	},
	{ _id: false }
);

const ChatSchema = new Schema<IChat>(
	{
		participants: [
			{ type: Schema.Types.ObjectId, ref: "User", required: true },
		],
		messages: [MessageSchema],
		title: { type: String },
	},
	{ timestamps: true }
);

const Chat = models?.Chat || model<IChat>("Chat", ChatSchema);

export default Chat;
