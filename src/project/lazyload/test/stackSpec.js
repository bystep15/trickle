describe('Lazyload Test Suite', function () {
    describe('Stack Test Suite', function () {
        'use strict';
 
        function inject(callback) {
            return function (done) {
                seajs.use('/project/lazyload/js/stack', function (Stack) {
                    callback(new Stack());
                    done();
                });
            };
        }
 
        it('将执行压栈操作', inject(function (stack) {
            stack.push(1);
            expect(stack.peek()).toBe(1);
        }));
 
        it('将执行出栈操作', inject(function (stack) {
            stack.push(1);
            expect(stack.pop()).toBe(1);
        }));
 
        it('将执行出栈操作，并删除所有相同的已入栈元素', inject(function (stack) {
            stack.push(0);
            stack.push(1);
            stack.push(2);
            stack.push(1);
            stack.push(1);
            expect(stack.pop()).toBe(1);
            expect(stack.pop()).toBe(2);
            expect(stack.pop()).toBe(0);
        }));
 
        it('将判断栈是否为空', inject(function (stack) {
            expect(stack.isEmpty()).toBe(true);
            stack.push(0);
            expect(stack.isEmpty()).toBe(false);
            stack.pop();
            expect(stack.isEmpty()).toBe(true);
        }));
 
        it('将清空栈', inject(function (stack) {
            stack.push(0);
            stack.push(1);
            stack.clear();
            expect(stack.isEmpty()).toBe(true);
        }));
 
        it('将预读栈顶', inject(function (stack) {
            stack.push(1);
            expect(stack.peek()).toBe(1);
            expect(stack.isEmpty()).toBe(false);
        }));
 
        it('将判断栈是否满了', inject(function (stack) {
            expect(stack.isFull()).toBe(false);
            stack.push(1);
            expect(stack.isFull()).toBe(false);
        }));
    });
});
