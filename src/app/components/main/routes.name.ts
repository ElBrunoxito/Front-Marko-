type Route = '/dashboard' | '/products' | '/buys' | '/buys/add-buy' | '/buys/edit-buy' |
             '/sales' | '/sales/add-sale' | '/sales/edit-sale' | '/business' |
             '/report' | '/report/generate' | '/No-Authorizated';

export const MAIN_ROUTE_NAME: { [key in Route]: string } = {
    '/dashboard': 'DASHBOARD',
    '/products': 'PRODUCTOS',
    '/buys': 'COMPRAS',
    '/buys/add-buy': 'AGREGAR COMPRA',
    '/buys/edit-buy': 'EDITAR COMPRA',
    '/sales': 'VENTAS',
    '/sales/add-sale': 'AGREGAR VENTA',
    '/sales/edit-sale': 'EDITAR VENTA',
    '/business': 'MI NEGOCIO',
    '/report': 'REPORTES',
    '/report/generate': 'GENERAR REPORTE',
    '/No-Authorizated': 'ACCESO DENEGADO',
};