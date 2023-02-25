<#
    Panashe Innocent Tafuma
    .Description
    Creates root src directories for a NestJs Project.
#>

Write-Host "builiding..." ForegroundColor Red

Set-Location .\src

$abstractEntityBoilerplate = @"
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ default: 'NOW()', update: false })
  createdAt: Date;

  @Column({ default: 'NOW()' })
  updatedAt: Date;

  @Column({ default: false })
  deleted: boolean;
}
"@

$commonIndex = @"
export * from './abstract.entity';
"@

ForEach ($Dir in ('common', 'decorators', 'exceptions', 'guards', 'modules', 'util')) {
    New-Item -ItemType Directory -Path .\$Dir

    if ($Dir -eq 'common') {
        New-Item -ItemType File -Path .\$Dir\abstract.entity.ts -Value $abstractEntityBoilerplate
        New-Item -ItemType File -Path .\$Dir\index.ts -Value $commonIndex
    }
} 

Clear-Host