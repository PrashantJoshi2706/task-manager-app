const {calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add} = require('../src/math');

test('Should calculate total with tip', ()=>{
    const total = calculateTip(10, .3);
    expect(total).toBe(13)
})
test('should calculate total with default tip percentage', ()=>{
    const total = calculateTip(10);
    expect(total).toBe(12)
})

test('celcius to fahrenheit conversion', ()=>{
    const temp = celsiusToFahrenheit(0);
    expect(temp).toBe(32);
})

test('fahrenheit to celcius conversion', ()=>{
    const temp = fahrenheitToCelsius(32);
    expect(temp).toBe(0);
})

// test('async test demo',(done)=>{
//     setTimeout(()=>{
//         expect(1).toBe(2);
//     }, 2000)  
// })

test('should add two number', (done)=>{
    add(2, 3).then((sum)=>{
        expect(sum).toBe(5)
        done();
    })
})

test('add two number async/await', async ()=>{
    const sum = await add(10, 22);
    expect(sum).toBe(32)
})