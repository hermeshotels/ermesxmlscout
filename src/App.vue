<template>
  <div class="header-wrapper">
    <div class="logo">
      <img src="assets/logo.png">
    </div>
    <div class="warning">
      Questa versione è in fase <span class="alpha">Alpha</span> <a href="mailto:w.miarelli@hermeshotels.com?subject=suggerimenti xml">Invia suggerimento.</a>
    </div>
  </div>
  <div class="error" v-if="error">
      <i class="material-icons">error</i> {{errorText}}
  </div>
  <div class="search-bar-wrapper">
    <div class="tip">Puoi ricercare testo contenuto in una richiesta XML per un dato periodo temporale.</div>
    <div class="form">
      <input type="text" v-model="text" class="e-input" placeholder="rate id = 6354" />
      <datepicker :readonly="true" format="YYYYMMDD0000" :value.sync="start"></datepicker>
      <datepicker :readonly="true" format="YYYYMMDD2359" :value.sync="end"></datepicker>
      <div class="start-search" v-on:click="getXml">
        RICERCA
      </div>
    </div>
  </div>

  <div class="no-result" v-if="results.length <= 0 && searching === false">
    <p>Nessun risultato da visualizzare, effettua una ricerca per consultare l'archivio XML.</p>
  </div>

  <div class="searching" v-if="searching">
    <p>Lost in the XML... getting out of hear may take a while.</p>
  </div>

  <div class="result-view" v-if="results.length > 0">
    <div class="list">
      <h4>
        <i class="material-icons">list</i> Lista dei risultati <br>
        <small>seleziona una richiesta per visualizzare il dettaglio</small>
      </h4>
      <ul>
        <li class="list-item" v-for="result in results" v-on:click="select(result)">
          ID Richiesta: <strong>{{result.SC_ID}}</strong>, <span class="requestCount"> {{getRequestCount(result)}} Richieste</span> e <span class="responseCount"> {{getResponseCount(result)}} Risposte</span>
        </li>
      </ul>
    </div>
    <div class="inspect" v-if="selectedResult">

      <div class="request" v-if="selectedResult.TX_RICHIESTA_XML.length > 0">
        <div class="code-header">
          Richiesta 1
        </div>
        <code class="prettyprint lang-xml">
          {{formatXml(selectedResult.TX_RICHIESTA_XML)}}
        </code>
      </div>

      <div class="request" v-if="selectedResult.TX_RICHIESTA2_XML.length > 0">
        <div class="code-header">
          Richiesta 2
        </div>
        <code class="prettyprint lang-xml">
          {{formatXml(selectedResult.TX_RICHIESTA2_XML)}}
        </code>
      </div>

      <div class="request" v-if="selectedResult.TX_RICHIESTA3_XML.length > 0">
        <div class="code-header">
          Richiesta 3
        </div>
        <code class="prettyprint lang-xml">
          {{formatXml(selectedResult.TX_RICHIESTA3_XML)}}
        </code>
      </div>

      <div class="request" v-if="selectedResult.TX_RISPOSTA_XML.length > 0">
        <div class="code-header">
          Risposta 1
        </div>
        <code class="prettyprint lang-xml">
          {{formatXml(selectedResult.TX_RISPOSTA_XML)}}
        </code>
      </div>

      <div class="request" v-if="selectedResult.TX_RISPOSTA2_XML.length > 0">
        <div class="code-header">
          Risposta 3
        </div>
        <code class="prettyprint lang-xml">
          {{formatXml(selectedResult.TX_RISPOSTA2_XML)}}
        </code>
      </div>

      <div class="request" v-if="selectedResult.TX_RISPOSTA3_XML.length > 0">
        <div class="code-header">
          Risposta 2
        </div>
        <code class="prettyprint lang-xml">
          {{formatXml(selectedResult.TX_RISPOSTA3_XML)}}
        </code>
      </div>

    </div>
  </div>
</template>

<script>
  /* global $ */
  import datepicker from 'vue-date-picker';
  import moment from 'moment';
  import beautify from 'xml-beautifier';
  export default{
    data() {
      return {
        searching: false,
        results: [],
        text: '',
        error: false,
        errorText: '',
        start: moment().format('YYYYMMDD0000'),
        end: moment().format('YYYYMMDD2359'),
        selectedResult: null,
      };
    },
    components: {
      datepicker,
    },
    methods: {
      getXml() {
        if (this.text.length <= 0) {
          this.error = true;
          this.errorText = 'Devi inserire del testo da ricercare.';
          return;
        }

        if (this.start.length <= 0) {
          this.error = true;
          this.errorText = 'Devi specificare una data di inizio.';
          return;
        }

        if (this.end.length <= 0) {
          this.error = true;
          this.errorText = 'Devi specificare una data di fine.';
          return;
        }
        this.searching = true;
        this.$http.get(`http://192.168.111.2:3000/xml/${this.text}/from/${this.start}/to/${this.end}`)
          .then((response) => {
            this.results = response.json();
            this.searching = false;
          }, (response) => {
            this.results = response.json();
            this.searching = false;
          });
      },
      getRequestCount(result) {
        let reqs = 0;
        if (result.TX_RICHIESTA_XML.lenght > 0) {
          reqs += 1;
        }

        if (result.TX_RICHIESTA2_XML.length > 0) {
          reqs += 1;
        }

        if (result.TX_RICHIESTA3_XML.length > 0) {
          reqs += 1;
        }
        return reqs;
      },
      getResponseCount(result) {
        let ress = 0;
        if (result.TX_RICHIESTA_XML.lenght > 0) {
          ress += 1;
        }

        if (result.TX_RICHIESTA2_XML.length > 0) {
          ress += 1;
        }

        if (result.TX_RICHIESTA3_XML.length > 0) {
          ress += 1;
        }
        return ress;
      },
      formatXml(xml) {
        return beautify(xml);
      },
      select(result) {
        this.selectedResult = result;
        $.SyntaxHighlighter.init();
      },
    },
  };
</script>

<style lang="scss">

@import url('https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900');
@import './variables.scss';

html,body {
  height: 100%;
  padding: 0;
  margin: 0;
  background-color: #ebeff1;
  font-family: 'Roboto', sans-serif;
}

*{
  box-sizing: border-box;
}

a{
    text-decoration: none;
    color: #0288D1;
}

.header-wrapper{
  width: 100%;
  height: 60px;
  background-color: #FFF;
  padding-left: 1em;
  padding-right: 1em;
  .logo{
    float: left;
    width: 30%;
    height: 100%;
    line-height: 60px;
    img{
      height: 15px;
      width: auto;
    }
  }
  .warning{
    float: left;
    width: 70%;
    text-align: right;
    line-height: 60px;
    .alpha{
      background-color: #41b782;
      border-radius: 3px;
      color: #FFF;
      padding: 0.3em;
    }
  }
}

.search-bar-wrapper{
  background-color: $primary-color;
  color: #FFF;
  padding-top: 30px;
  padding-bottom: 30px;
  margin-bottom: 60px;
  .tip{
    text-align: center;
  }
  .form{
    width: 80%;
    margin: 0 auto;
    position: relative;
    margin-top: 20px;
    padding-bottom: 30px;
    text-align: center;
    .e-input, .datetime-picker input{
      border: 0;
      border-radius: 3px;
      height: 36px;
      font-family: 'Roboto', sans-serif;
      font-size: 1.1rem;
      padding: 0.5rem;
      width: 30%;
      margin-right: 10px;
      &:last-child{
        margin-right: 0;
      }
      &:focus{
        outline: 0;
      }
      &.date{
        width: 20%;
      }
    }
    .datetime-picker{
      margin-right: 10px;
    }
    .datetime-picker input{
      width: 100%;
      margin-right: 0;
    }
  }
  .start-search{
    position: absolute;
    height: 40px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    bottom: -50px;
    width: 100px;
    background-color: #FFF;
    color: $primary-color;
    left: 50%;
    margin-left: -50px;
    border-radius: 3px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.01), 0 3px 6px rgba(0,0,0,0.16);
  }
}

.no-result, .searching{
  width: 80%;
  margin: 0 auto;
  padding-top: 60px;
  p{
    font-size: 1.3rem;
    font-weight: 300;
    text-align: center;
  }
}

.result-view{
  width: 85%;
  margin: 0 auto;
  .list{
    width: 40%;
    float: left;
    h4{
      font-size: 1.1rem;
      color: rgb(108, 124, 131);
      small{
        font-weight: 300;
      }
      i{
        vertical-align: middle;
      }
    }
    ul{
      list-style: none;
      padding: 0;
      margin: 0;
      li{
        color: #424242;
        background-color: #FFF;
        border-radius: 3px;
        margin-bottom: 15px;
        padding: 0.8em;
        box-shadow: 0 2px 6px 2px rgba(0,0,0,0.05);
        cursor: pointer;
        transition: all 0.5s ease-in-out;
        &:hover{
          box-shadow: 0 2px 6px 2px rgba(0,0,0,0.1);
        }
        i{
          vertical-align: middle;
          font-size: 10px;
        }
        .requestCount{
          color: #2E7D32;
        }
        .responseCount{
          color: #F57F17;
        }
      }
    }
  }
  .inspect{
    width: 55%;
    margin-left: 5%;
    float: left;
    padding: 1em;
  }
}

.prettyprint{
  box-shadow: 0 2px 6px 2px rgba(0, 0, 0, 0.05);
  border: 0;
  border-radius: 3px;
  background-color: #FFF;
  margin-bottom: 20px;
  padding: 1em;
}

.code-header{
  color: $font-color;
  font-weight: 500;
  margin-bottom: 15px;
}

.error{
  background-color: #e53935;
  color: #FFF;
  text-align: center;
  padding-top: 15px;
  padding-bottom: 15px;
  i{
    vertical-align: middle;
  }
}

</style>
