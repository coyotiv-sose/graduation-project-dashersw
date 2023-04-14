const initialsExtractor = require('../src/lib/initials-extractor')

describe('initialsExtractor', () => {
  it('should return the initials of the name', () => {
    const actualOutput = initialsExtractor('Armagan Amcalar')
    const expectedOutput = 'AA'

    expect(actualOutput).toBe(expectedOutput)
  })

  it('should return the initials of a name with a middle name', () => {
    const actualOutput = initialsExtractor('John Doe Smith')
    const expectedOutput = 'JDS'

    expect(actualOutput).toBe(expectedOutput)
  })

  it('should return all the initials of a name with multiple middle names', () => {
    const actualOutput = initialsExtractor('Rodrigo Martinez de la Cruz')
    const expectedOutput = 'RMC'

    expect(actualOutput).toBe(expectedOutput)
  })

  it('should shorten zu to z', () => {
    const actualOutput = initialsExtractor('Andreas zu Guttenberg')
    const expectedOutput = 'AzG'

    expect(actualOutput).toBe(expectedOutput)
  })

  it('should not shorten za to z', () => {
    const actualOutput = initialsExtractor('Andreas za Guttenberg')
    const expectedOutput = 'AG'

    expect(actualOutput).toBe(expectedOutput)
  })

  it('should throw an error if the name has more than 10 words', () => {
    const name = 'John Doe Smith John Doe Smith John Doe Smith John Doe'

    expect(() => initialsExtractor(name)).toThrowError('Too many names')
  })

  it('should cover exceptions such as den, van, von, der, le, les', () => {
    const exceptions = ['zu', 'van', 'von', 'der', 'den', 'le', 'les']
    const names = exceptions.map(e => `John ${e} Neumann`)
    const initials = exceptions.map(e => `J${e[0]}N`)

    const actualOutputs = names.map(initialsExtractor)
    const expectedOutputs = initials

    expect(actualOutputs).toEqual(expectedOutputs)
  })
})
