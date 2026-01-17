const genericErrorHandler = (err, req, res, next) => {
    // 1. Logam eroarea in consola ca sa o vedem noi (programatorii)
    console.error("URGENT - EROARE PRISA DE MIDDLEWARE:", err.stack);

    // 2. Trimitem un raspuns standard catre client (React/Postman)
    // Astfel, serverul nu ramane blocat (hanging)
    res.status(500).json({
        message: "A aparut o eroare neprevazuta pe server.",
        error: err.message // Optional: trimitem si mesajul tehnic
    });
};

export default genericErrorHandler;