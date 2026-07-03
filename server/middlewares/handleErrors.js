
export const notFoundError = (req, res) => {
    res.status(404).json( {
        statusCode: 404,
        emoji: '🔍',
        title: 'Page not found',
        message: "We couldn't find what you were looking for."
    });
}

export const globalError = (error, req, res, next) => {
    console.log(error.message);
    res.status(500).json({
        statusCode: 500,
        emoji: '🔥',
        title: 'Something went wrong',
        message: 'An unexpected error occurred on our side. Try again in a moment.'
    });
}

