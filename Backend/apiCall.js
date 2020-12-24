
  const poll = {
    pollB: function() {
        https.get('https://api.covid19india.org/raw_data1.json', (res) => {
            const { statusCode } = res;
  
            let error;
            if (statusCode !== 200) {
                error = new Error(`Request Failed.\n` +
                    `Status Code: ${statusCode}`);
            }
  
            if (error) {
                console.error(error.message);
                res.resume();
            } else {
                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => { rawData += chunk; });
                res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        console.log(parsedData);
                        // The important logic comes here
                        if (parsedData.status === 'BUSY') {
                            setTimeout(poll.pollB, 10000); // request again in 10 secs
                        } else {
                            // Call the background process you need to
                        }
                    } catch (e) {
                        console.error(e.message);
                    }
                });
            }
        }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
        });
    }
  }
  
  poll.pollB();