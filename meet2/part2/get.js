// because Fetch API is designed with Promise,
// we can use `async` and `await`
async function getQuote() {
  try {
    // wait the server to respond
    const response = await fetch(
      'https://quotes.liupurnomo.com/api/quotes/random',
    );

    if (!response.ok)
      throw new Error(`Response status code: ${response.status}`);

    // wait the response body to fully read,
    // then parsed the JSON into object
    const body = await response.json();
    // {
    //   status: 'SUCCESS',
    //   message: 'Random quote berhasil diambil',
    //   data: {
    //     text: 'Sangat sulit merancang produk berdasarkan kelompok fokus. Seringkali, orang tidak tahu apa yang mereka inginkan sampai kamu menunjukkannya.',
    //     author: 'Steve Jobs',
    //     category: 'desain',
    //     id: 306
    //   },
    //   metadata: { totalAvailable: 980, category: null }
    // }

    const quote = body.data.text;
    console.log(`Quote hari ini: "${quote}"`);
  } catch (error) {
    console.log(`Failed to get quote: ${error}`);
  }
}

getQuote();
// Quote hari ini: "Tidak apa-apa kalah, asalkan kamu tidak menyerah."
