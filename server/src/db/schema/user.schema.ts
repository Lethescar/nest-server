import { User } from 'src/interface/user.interface';
import { SchemaFactory } from '@nestjs/mongoose';

export const UserSchema = SchemaFactory.createForClass(User);
