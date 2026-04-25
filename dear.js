console.log("hello freinds ");
//Header Area
//Siderbar Area
 function updateEra(value) {
        let text = "";

        if (value < 1500) {
          text = "Ancient Era (" + value + ")";
        }
        else if (value >= 1500 && value < 1900) {
          text = "Medieval Era (" + value + ")";
        }
        else {
          text = "Modern Era (" + value + ")";
        }

        document.getElementById("eraprint").innerHTML = text;
      }
//Middle Area
//Fotter AREA