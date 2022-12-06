import {suite, test} from "@testdeck/mocha";
import dependencyManager, {inject} from "../../../src/model/injection/InjectDecorator";
import {assert, expect} from "chai";
import {Composer, Disposer} from "../../../src/scenes/model/Scene";

@suite
class InjectDecoratorTest {

    before() {
        dependencyManager.unload();
    }

    @test
    injectionTest():void {
        let testTarget = new TestTarget();
        dependencyManager.register(TestTarget, testTarget);
        let testClass = new TestClass();
        testClass.compose();
        expect(testClass.target)
            .is.not.equal(undefined);
        expect(testClass.target).is.equal(testTarget);
        testClass.dispose();
        expect(testClass.target).is.equal(undefined);
    }

    @test
    resolveTest() {
        let expectedResult = new TestTarget();
        let actualResult = dependencyManager.resolve(TestTarget, () => {
            return expectedResult;
        });
        expect(actualResult).is.equal(expectedResult);
    }

    @test
    resolveWithNullInstanceTest() {
        assert.throw(() => {
            dependencyManager.resolve(TestTarget);
        }, "key: class TestTarget {\r\n} is not defined.");
    }

    @test
    hasTest() {
        let expectedResult = new TestTarget();
        expect(dependencyManager.has(TestTarget)).is.equal(false);
        expect(
            dependencyManager
                .register(TestTarget, expectedResult)
                .has(TestTarget)
        ).is.equal(true);
    }
}

class TestTarget {

}

class TestClass implements Composer, Disposer{
    @inject(TestTarget)
    target:TestTarget;

    compose() {

    }

    dispose():void {
    }
}