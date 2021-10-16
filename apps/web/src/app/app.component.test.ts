import * as app_component from "./app.component"
// @ponicode
describe("app_component.shouldShowBackground", () => {
    test("0", () => {
        let callFunction: any = () => {
            app_component.shouldShowBackground("https://")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            app_component.shouldShowBackground("https://api.telegram.org/")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            app_component.shouldShowBackground("https://api.telegram.org/bot")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            app_component.shouldShowBackground("https://croplands.org/app/a/reset?token=")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            app_component.shouldShowBackground("https://accounts.google.com/o/oauth2/revoke?token=%s")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            app_component.shouldShowBackground("")
        }
    
        expect(callFunction).not.toThrow()
    })
})
