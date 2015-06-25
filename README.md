# ZPicker
Iddle game developed with AngularJS

Practicando AngularJS hice un pequeño juego demo utilizando los conceptos básicos de Angular ($scope, $http, $apply, controllers, ng-click, ng-repeat, ng-app, ng-controller, formats).

99% es Angular (la animación del progress bar está hecha con jQuery). Además usé bootstrap para los estilos.

El juego es sencillo: simula ser un comercio que compra y venta. El objetivo es intentar conseguir la mayor cantidad de dinero posible (los que conocen el juego Adventure Capitalist o han jugado un Iddle game ya conocen cómo va la cosa).

Se vende haciendo click sobre el progress bar. Los botones de compra se habilitan cuando hay dinero suficiente (y viceversa). Los valores de compra, venta y total se transforman al llegar a 1000 en una nueva unidad (mil, millones, billones, etc.) o bajan de unidad al ser inferiores a 1.

A determinada cantidad de stock se incrementa la velocidad de venta del producto, se incrementa el precio de compra, se reduce el de venta, y los multiplicadores se van reduciendo a medida que se avanza, para que sea cada vez más dificil y que el crecimiento no sea 100% exponencial.
