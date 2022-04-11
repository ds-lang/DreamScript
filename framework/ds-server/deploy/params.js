// Environtment

function parse(url) {
    const results = url.match(/\?(?<query>.*)/);
    if (!results) {
        return {};
    }
    const {
        groups: {
            query
        }
    } = results;

    const pairs = query.match(/(?<param>\w+)=(?<value>\w+)/g);
    const params = pairs.reduce((acc, curs) => {
        const [key, value] = curs.split(("="));
        acc[key] = value;
        return acc;
    }, {});
    return params;
}

module.exports = parse;