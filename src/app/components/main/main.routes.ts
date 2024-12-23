import { Routes } from "@angular/router";
import { ProductsComponent } from "./product/products/products.component";
import { AddProductComponent } from "./product/add-product/add-product.component";
import { BuysComponent } from "./buy/buys/buys.component";
import { AddBuyComponent } from "./buy/add-buy/add-buy.component";
import { SalesComponent } from "./sale/sales/sales.component";
import { AddSaleComponent } from "./sale/add-sale/add-sale.component";
import { CollectWidgetComponent } from "../widgets/collect-widget/collect-widget.component";
import { ReportsComponent } from "./report/reports/reports.component";
import { GenerateReportComponent } from "./report/generate-report/generate-report.component";
import { BusinessComponent } from "./business/business.component";
import { NoPermissionComponent } from "../no-permission/no-permission.component";
import { protectedRoutesAdminGuard } from "../../guards/protected-routes-admin.guard";



export const MAIN_ROUTES:Routes=[
    {
      path:''  ,
      redirectTo: 'sales',
      pathMatch:'full'
    },
    { path:'products', component:ProductsComponent, canActivate:[protectedRoutesAdminGuard]},

    { path:'buys', component:BuysComponent,canActivate:[protectedRoutesAdminGuard] },
    { path:'buys/add-buy', component:AddBuyComponent, canActivate:[protectedRoutesAdminGuard]},
    { path:'buys/edit-buy/:idBuy', component:AddBuyComponent,canActivate:[protectedRoutesAdminGuard]},

    { path:'sales',component:SalesComponent },
    { path:'sales/add-sale', component:AddSaleComponent},
    { path:'sales/edit-sale/:idSale', component:AddSaleComponent},

    { path:'business', component:BusinessComponent,canActivate:[protectedRoutesAdminGuard]},


    { path:'report', component:ReportsComponent,canActivate:[protectedRoutesAdminGuard]},
    { path:'report/generate', component:GenerateReportComponent,canActivate:[protectedRoutesAdminGuard]},


    {
      path:'No-Authorizated',
      component:NoPermissionComponent
    }









    //{ path:'buys', component:OrdersComponent},
    //{ path:'sales', component:OrderAddComponent},
    
    //{ path:'edit/:idOrder',canActivate:[validEditOrderGuard], component:OrderAddComponent}
    
    
]