import * as assert from 'assert'
import * as E from '../src/Expression'

function assertExpression<A>(expression: E.Expression<A>, expected: string): void {
  assert.deepStrictEqual(E.print(expression.expression()), expected)
}

describe('Expression', () => {
  it('string', () => {
    assertExpression(E.string, 'S.string')
  })

  it('string', () => {
    assertExpression(E.string, 'S.string')
  })

  it('number', () => {
    assertExpression(E.number, 'S.number')
  })

  it('boolean', () => {
    assertExpression(E.boolean, 'S.boolean')
  })

  it('UnknownArray', () => {
    assertExpression(E.UnknownArray, 'S.UnknownArray')
  })

  it('UnknownRecord', () => {
    assertExpression(E.UnknownRecord, 'S.UnknownRecord')
  })

  it('array', () => {
    assertExpression(E.array(E.string), 'S.array(S.string)')
  })

  it('record', () => {
    assertExpression(E.record(E.number), 'S.record(S.number)')
  })

  it('union', () => {
    assertExpression(E.union(E.string, E.number), 'S.union(S.string, S.number)')
    assertExpression(E.union(), 'S.union()')
  })

  it('intersection', () => {
    assertExpression(E.intersection(E.string, E.number), 'S.intersection(S.string, S.number)')
  })

  it('tuple', () => {
    assertExpression(E.tuple(E.string, E.number), 'S.tuple(S.string, S.number)')
  })

  it('type', () => {
    assertExpression(E.type({ a: E.string }), 'S.type({ a: S.string })')
  })

  it('partial', () => {
    assertExpression(E.partial({ a: E.string }), 'S.partial({ a: S.string })')
  })

  it('literal', () => {
    assertExpression(E.literal(1, 'a', null, true), 'S.literal(1, "a", null, true)')
    assertExpression(E.literal(), 'S.literal()')
  })

  it('sum', () => {
    const sum = E.sum('_tag')
    assertExpression(
      sum({
        A: E.type({ _tag: E.literal('A'), a: E.string }),
        B: E.type({ _tag: E.literal('B'), b: E.number })
      }),
      'S.sum("_tag")({ A: S.type({ _tag: S.literal("A"), a: S.string }), B: S.type({ _tag: S.literal("B"), b: S.number }) })'
    )
    assertExpression(sum({}), 'S.sum("_tag")({})')
  })

  describe('lazy', () => {
    it('lazy', () => {
      assertExpression(
        E.lazy('A', () => E.intersection(E.type({ a: E.number }), E.partial({ b: E.$ref('A') }))),
        'S.lazy(() => S.intersection(S.type({ a: S.number }), S.partial({ b: A(S) })))'
      )
    })

    it('lazy', () => {
      interface A {
        a: number
        b?: A
      }

      const expression: E.Expression<A> = E.lazy('A', () =>
        E.intersection(E.type({ a: E.number }), E.partial({ b: expression }))
      )

      assertExpression(expression, 'S.lazy(() => S.intersection(S.type({ a: S.number }), S.partial({ b: A(S) })))')
    })
  })
})
