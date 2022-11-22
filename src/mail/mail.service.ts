import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MailEntity } from "@/mail/entities/mail.entity";
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from "typeorm";


@Injectable()
export class MailService {

  constructor(
    @InjectRepository(MailEntity)
    private readonly repository: Repository<MailEntity>
  ) {}


  async findMany(options: FindManyOptions<MailEntity>) {
    return  this.repository.find(options);
  }


  async findOne(options: FindOneOptions<MailEntity>) {
      return  this.repository.findOne(options);
  }

  async create(entity: DeepPartial<MailEntity>) {
      return  this.repository.save(this.repository.create(entity));
  }

  hardDelete(id: number) {
    return this.repository.delete(id);
  }
}