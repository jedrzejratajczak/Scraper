async function getProducts(url) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'sec-ch-ua-platform': '"Windows"',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'sec-ch-ua': '"Google Chrome";v="121", "Not:A-Brand";v="99", "Chromium";v="121"',
      'Content-Type': 'application/json',
      'DNT': '1',
      'sec-ch-ua-mobile': '?0',
      'Sec-GPC': '1',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Dest': 'empty'
    },
    body: JSON.stringify({
      searchParams: "Me57_Oc",
      offset: 0,
      limit: 200,
      language: "pl",
      overview: false
    })
  });

  const rawText = await response.text();

  let data;
  try {
    data = JSON.parse(rawText);
  } catch (error) {
    const errorDetails = {
      message: 'Failed to parse JSON response',
      parseError: error.message,
      httpStatus: `${response.status} ${response.statusText}`,
      contentType: response.headers.get('content-type'),
      contentLength: rawText.length,
      responsePreview: rawText.substring(0, 500),
      url: url
    };
    throw new Error(JSON.stringify(errorDetails, null, 2));
  }

  return data.articles
    .filter(article => article.articleNumber)
    .map(article => ({
      src: `${process.env.H_BASE_IMG}${article.images?.preview?.path || ''}${article.images?.preview?.file || ''}`,
      price: undefined,
      title: article.localization?.enName,
      href: `${process.env.H_BASE}/de/pl/product/${article.articleNumber}`,
      productId: article.articleNumber
    }));
};

export { getProducts };
