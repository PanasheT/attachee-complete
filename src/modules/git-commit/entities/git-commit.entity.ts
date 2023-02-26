import { AbstractEntity } from 'src/common';
import { Entity } from 'typeorm';

@Entity({ name: 'git-commit' })
export class GitCommitEntity extends AbstractEntity {}
