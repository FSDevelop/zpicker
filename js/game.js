/**
 * ZPicker
 * @author  Federico Sosa (federico.develop@gmail.com)
 * @since   06-23-2015
 */

var game = angular.module('ZPicker', []);

game.controller('mainController', ['$scope', '$http', function($scope, $http) {
    /**
     * Get all the products from the products.json file
     * @since 06-24-2015
     */
    $http.get('json/data.json').success(function(data) {
        $scope.products = data[0].products;
        $scope.units = data[0].units[0];
    });
    $scope.total = {
        amount: 0,
        unit: ""
    };
    /**
     * When someone clicks on the sell button
     * @since   06-23-2015
     */
    $scope.sell = function(Id) {
        var product = $scope.products[Id];
        
        // We are going to be able to sell products if we have at least one item
        if (product.quantity > 0) {
            
            // Calculating the speed of selling the product
            speed = product.speed;
                
            // Speed levels
            var levels = [10, 25, 50, 100, 200, 400, 800];
            
            var buyMultiplier = 1.07;
            var sellMultiplier = 1.09;
            
            for (i = 0; i < levels.length; i++) {
                if (product.quantity >= levels[i]) {
                    speed = speed / 1.5;
                    
                    buyMultiplier += 0.01;
                    sellMultiplier -= 0.01;
                    
                    buyMultiplier = (buyMultiplier > 2) ? 2 : buyMultiplier;
                    sellMultiplier = (sellMultiplier < 1.01) ? 1.01 : sellMultiplier;
                }
            }
            
            product.multipliers.buy = buyMultiplier;
            product.multipliers.sell = sellMultiplier;
            
            // Animate the selling
            $scope.animateSell(Id, speed);
        }
    };
    /**
     * Selling process animation
     * Note: Some things happen just after the animation
     * @since   06-23-2015
     */
    $scope.animateSell = function(Id, speed) {
        var product = $scope.products[Id];
        
        // Do the sell only if we are not already selling
        if (!product.sellingProcess) {
            product.sellingProcess = true; // Selling = ON
            
            // Start animation
            jQuery('.progress #progress_' + Id).animate({width: '100%'}, speed, function() {
                jQuery(this).css({width: '0%'}); // Go back to the start after finishing
                product.sellingProcess = false; // Stop process logically
                
                // Add the profits of the sale
                $scope.$apply(function() {
                    $scope.changeProfit('get', product.prices.sell);
                });
                
                // Things that have to happen after the sale
                $scope.afterBuySell();
            });
        }
    };
    /**
     * Add profits to the total
     * @since   06-25-2015
     */
    $scope.changeProfit = function(type, price) {
    
        var obj = $scope.units;

        units = new Array();
        $.each(obj, function(key, value) { 
          units.push(value);
        });
    
        amountLevel = units.indexOf(price.unit);
        totalLevel = units.indexOf($scope.total.unit);
    
        // If the sell amount and the total amount are in the same level
        // with can sum them as it.
        if ($scope.total.unit == price.unit) {
            $scope.total.amount += (type == 'get') ? price.amount : -price.amount; // Get profits
        } else {
            amount = price.amount;
            totalAmount = $scope.total.amount;
            
            // If the sell amount is on a lower level of amount
            if (amountLevel < totalLevel) {
                // Convert sell price to the total unit
                for (i = amountLevel; i < totalLevel; i++) {
                    amount = amount / 1000;
                }
                
                // Add sale price to the total amount
                $scope.total.amount += (type == 'get') ? amount : -amount;
            } else {
                $scope.total.amount = amount;
                
                // Convert the total to the same unit
                for (i = totalLevel; i < amountLevel; i++) {
                    totalAmount = totalAmount / 1000;
                }
                
                // Add converted total money to the total real
                $scope.total.amount += totalAmount;
                
                // Change the unit of the total to the same as sale price
                $scope.total.unit = price.unit;
            }
        }
        
        // If the new total price if higher than 999
        // then: increase the unit level to the next;
        if ($scope.total.amount > 999) {
            $scope.total.amount = $scope.total.amount / 1000;
            $scope.total.unit = units[totalLevel + 1];
        } else if ($scope.total.amount < 1) {
            if ((totalLevel - 1) >= 0) {
                $scope.total.amount = $scope.total.amount * 1000;
                $scope.total.unit = units[totalLevel - 1];
            }
        }
    };
    /**
     * When someone clicks on buy
     * @since   06-23-2015
     */
    $scope.buy = function(Id) {
        var product = $scope.products[Id];
        
        buyLevel = units.indexOf(product.prices.buy.unit);
        totalLevel = units.indexOf($scope.total.unit);
        
        // Know if there is enough money to buy
        if (totalLevel >= buyLevel) {
            
            ableToBuy1 = ($scope.total.amount - product.prices.buy.amount >= 0) && (totalLevel == buyLevel);
            ableToBuy2 = (totalLevel > buyLevel);
            
            if (ableToBuy1 || ableToBuy2) {
                // Increase product's quantity
                product.quantity += 1;
                
                // Add the profits of the sale
                $scope.changeProfit('lose', product.prices.buy);
                
                if (product.quantity == 1) {
                    product.canSell = "";
                }
                    
                // Change the selling and buying price
                if (product.quantity > 1) {
                    $scope.changePrice(Id);
                }
                
                $scope.afterBuySell();
            }
        }
    };
    /**
     * Change the selling and buying price
     * @since   06-24-2015
     */
    $scope.changePrice = function(Id) {
        var product = $scope.products[Id];
        
        // Defining prices and multipliers
        var prices = product.prices;
        var multipliers = product.multipliers;
            
        // Calculating new prices
        var newSellPrice = prices.sell.amount * multipliers.sell;
        var newBuyPrice = prices.buy.amount * multipliers.buy;
            
        $scope.products[Id].prices.buy.amount = (newBuyPrice);
        $scope.products[Id].prices.sell.amount = (newSellPrice);
        
        buyLevel = units.indexOf($scope.products[Id].prices.buy.unit);
        sellLevel = units.indexOf($scope.products[Id].prices.sell.unit);
        
        if ($scope.products[Id].prices.buy.amount > 999) {
            $scope.products[Id].prices.buy.amount /= 1000;
            $scope.products[Id].prices.buy.unit = units[buyLevel + 1];
        }
        
        if ($scope.products[Id].prices.sell.amount > 999) {
            $scope.products[Id].prices.sell.amount /= 1000;
            $scope.products[Id].prices.sell.unit = units[sellLevel + 1];
        }
    }
    /**
     * Things that have to happen after the sell
     * @since   06-24-2015
     */
    $scope.afterBuySell = function() {
        for (i = 0; i < $scope.products.length; i++) {
            product = $scope.products[i];
            
            buyLevel = units.indexOf(product.prices.buy.unit);
            totalLevel = units.indexOf($scope.total.unit);
            
            // Allow buy only if there is enough money (in the total)
            if (totalLevel >= buyLevel) {
                // Allow buy only if they are in the same unit,
                // or the buy unit is lower than the total unit
                ableToBuy1 = ($scope.total.amount - product.prices.buy.amount >= 0) && (totalLevel == buyLevel);
                ableToBuy2 = (totalLevel > buyLevel);
                
                if (ableToBuy1 || ableToBuy2) {
                    $scope.$apply(function() {
                        product.buyButton = "success";
                    });
                } else {
                    product.buyButton = "default";
                }
            } else {
                product.buyButton = "default";
            }
        }
    };
}]);