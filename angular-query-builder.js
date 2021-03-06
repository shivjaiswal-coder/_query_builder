var app = angular.module('app', ['ngSanitize', 'queryBuilder']);
app.controller('QueryBuilderCtrl', ['$scope', function ($scope) {
    var data = '{"group": {"operator": "AND","rules": []}}';

    function htmlEntities(str) {
        return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function computed(group) {
        if (!group) return "";
        for (var str = "[", i = 0; i < group.rules.length; i++) {
            i > 0 && (str += " <strong>" + group.operator + "</strong> ");
            str += group.rules[i].group ?
                computed(group.rules[i].group) :
                group.rules[i].field + " " + htmlEntities(group.rules[i].condition) + " " + htmlEntities(group.rules[i].criteria) + " "
                //  + group.rules[i].data;
        }

        return str + "]";
    }

    $scope.json = null;

    $scope.filter = JSON.parse(data);

    $scope.$watch('filter', function (newValue) {
        $scope.json = JSON.stringify(newValue, null, 2);
        $scope.output = computed(newValue.group);
    }, true);
}]);

var queryBuilder = angular.module('queryBuilder', []);
queryBuilder.directive('queryBuilder', ['$compile', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            group: '='
        },
        templateUrl: '/queryBuilderDirective.html',
        compile: function (element, attrs) {
            var content, directive;
            content = element.contents().remove();
            return function (scope, element, attrs) {
                scope.operators = [
                    { name: 'AND' },
                    { name: 'OR' }
                ];

                scope.fields = [
                    { name: 'Select field' },
                    { name: 'Theme' },
                    { name: 'Sub-theme' },
                    { name: 'Reason' },
                    { name: 'Source' },
                    { name: 'Rating' },
                    { name: 'Time Period' },
                    { name: 'Customer ID' }
                ];

                scope.conditions = [
                    { name: 'Select condition' },
                    { name: 'Equals' },
                    { name: 'Does not equal' },
                    { name: 'Like' },
                    { name: 'Not Like' },
                    { name: 'Is Empty' },
                    { name: 'Is' },
                    { name: 'Is not' }
                ];

                scope.criterias = [
                    { name: 'Select criteria' },
                    { name: 'Offers' },
                    { name: 'Performance' },
                    { name: 'Platform' },
                    { name: 'Product Feedback' }
                ];

                scope.addCondition = function () {
                    scope.group.rules.push({
                        condition: 'Select condition',
                        field: 'Select field',
                        criteria: 'Select criteria',
                        // data: ''
                    });
                };

                scope.removeCondition = function (index) {
                    scope.group.rules.splice(index, 1);
                };

                scope.addGroup = function () {
                    scope.group.rules.push({
                        group: {
                            operator: 'AND',
                            rules: []
                        }
                    });
                };

                scope.removeGroup = function () {
                    "group" in scope.$parent && scope.$parent.group.rules.splice(scope.$parent.$index, 1);
                };

                directive || (directive = $compile(content));

                element.append(directive(scope, function ($compile) {
                    return $compile;
                }));
            }
        }
    }
}]);
