<#
    Panashe Innocent Tafuma
    .Description
    Creates a directories for a NestJs module.
#>

Write-Host "initializing..." -ForegroundColor Red
$moduleName = Read-Host -Prompt "enter module name"

if (-not $moduleName -or -not $moduleName.Trim()) {
    Write-Error "module name is strictly required"
    return
}

$cModuleName = $moduleName.substring(0, 1).toUpper() + $moduleName.substring(1)
$moduleDirectory = Join-Path -Path (Join-Path -Path $PSScriptRoot -ChildPath "src") -ChildPath "modules\$moduleName"
New-Item -ItemType Directory -Path $moduleDirectory

$directories = @("entities", "controllers", "services", "dtos", "factories")

$controllerBoilerplate = @"
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ${cModuleName}Service } from '../services';

@Controller('${moduleName}s')
@ApiTags('${moduleName}s')
export class ${cModuleName}Controller {
    constructor(private readonly service: ${cModuleName}Service) {}
}
"@

$controllerIndex = @"
export * from './${moduleName}.controller';
"@

$factoryBoilerplate = @"
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ${cModuleName}Factory {
    constructor(
        @InjectRepository(${cModuleName}Entity)
        private readonly repo: Repository<${cModuleName}Entity>
    ) {}
}
"@

$factoryIndex = @"
export * from './${moduleName}.factory';
"@

$serviceBoilerplate = @"
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${cModuleName}Entity } from '../entities';

@Injectable()
export class ${cModuleName}Service {
    constructor(
        @InjectRepository(${cModuleName}Entity)
        private readonly repo: Repository<${cModuleName}Entity>,    
    ) {}
}
"@

$serviceIndex = @"
export * from './${moduleName}.service';
"@

$createDtoBoilerplate = @"
export class Create${cModuleName}Dto {}
"@

$createDtoIndex = @"
export * from './create-${moduleName}.dto';
"@


$entityBoilerplate = @"
import { Entity } from 'typeorm';
import { AbstractEntity } from 'src/common';


@Entity({ name: '${moduleName}' })
export class ${cModuleName}Entity extends AbstractEntity {}
"@

$entityIndex = @"
export * from './${moduleName}.entity';
"@

$moduleBoilerplate = @"
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${cModuleName}Controller } from './controllers';
import { ${cModuleName}Service } from './services';
import { ${cModuleName}Entity } from './entities';

@Module({
    imports: [TypeOrmModule.forFeature([${cModuleName}Entity])],
    controllers: [${cModuleName}Controller],
    exports: [${cModuleName}Service],
    providers: [${cModuleName}Service],
})
export class ${cModuleName}Module {}
"@

New-Item -Name "$moduleName.module.ts" -ItemType 'file' -Path $moduleDirectory
Set-Content -Path "$moduleDirectory\$moduleName.module.ts" -Value $moduleBoilerplate


foreach ($dir in $directories) {
    $subdirectory = Join-Path -Path $moduleDirectory -ChildPath $dir
    New-Item -ItemType Directory -Path $subdirectory | Out-Null
    Set-Location $subdirectory

    New-Item -Name "index.ts" -ItemType "file"

    switch ($dir) {
        "controllers" {
            if ($moduleName) {
                New-Item -Name "$moduleName.controller.ts" -ItemType "file"
                Set-Content -Path ".\$moduleName.controller.ts" -Value $controllerBoilerplate
                Set-Content -Path ".\index.ts" -Value $controllerIndex
            }
        }
        "services" {
            if ($moduleName) {
                New-Item -Name "$moduleName.service.ts" -ItemType "file"
                Set-Content -Path ".\$moduleName.service.ts" -Value $serviceBoilerplate
                Set-Content -Path ".\index.ts" -Value $serviceIndex
            }
        }
        "dtos" {
            if ($moduleName -ne "auth") {
                New-Item -Name "create-$moduleName.dto.ts" -ItemType "file"
                Set-Content -Path ".\create-$moduleName.dto.ts" -Value $createDtoBoilerplate
                Set-Content -Path ".\index.ts" -Value $createDtoIndex
            }
        }
        "entities" {
            if ($moduleName -ne "auth") {
                New-Item -Name "$moduleName.entity.ts" -ItemType "file"
                Set-Content -Path ".\$moduleName.entity.ts" -Value $entityBoilerplate
                Set-Content -Path ".\index.ts" -Value $entityIndex
            }
        }
        "factories" {
            if ($moduleName -ne "auth") {
                New-Item -Name "$moduleName.factory.ts" -ItemType "file"
                Set-Content -Path ".\$moduleName.factory.ts" -Value $factoryBoilerplate
                Set-Content -Path ".\index.ts" -Value $factoryIndex
            }
        }
    }

    Set-Location ..
}

Write-Host "Module directory created: $moduleDirectory" -ForegroundColor Green
