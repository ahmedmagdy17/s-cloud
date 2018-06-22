import { NgModule } from '@angular/core'
import { MatDividerModule, MatListModule, MatCheckboxModule } from '@angular/material';

@NgModule({
    imports: [MatDividerModule, MatListModule, MatCheckboxModule],
    exports: [MatDividerModule, MatListModule, MatCheckboxModule]
})

export class MaterialModule {}