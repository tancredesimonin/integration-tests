import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";

@Entity({ name: 'mail'})
export class MailEntity {
  constructor(partial: Partial<MailEntity>) {
    Object.assign(this, partial)
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  to: string;

  @Column({ type: 'varchar', nullable: true })
  subject: string | null;

  @Column({ type: 'varchar', nullable: true })
  templateId: number;

  @Column("simple-json")
  params: { [key: string]: string; };

  @Column("simple-json")
  parsedParams: { [key: string]: string; };

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: string | null;
}