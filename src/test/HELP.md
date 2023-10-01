`const response = {}
expect(response.timings).to.have.property('elapsedTime').that.is.a('number');
`

`const err = {}
expect(err.response).to.eql(undefined);
            expect(err.message).to.contain('connect ECONNREFUSED');
`
