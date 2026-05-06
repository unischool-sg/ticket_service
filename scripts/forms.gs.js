const API_URL = "https://ticket.unischool.jp/api/callback/forms";
const TOKEN = PropertiesService.getScriptProperties().getProperty("API_KEY");


/**
 * この関数は、Google Formsのスクリプトエディタで一度だけ実行するための関数です。
 * これにより、Google FormsのAPIへの認証が行われ、フォームのデータをAPIに送信するためのアクセス権が得られます。
 * この関数は、Google Formsのスクリプトエディタで手動で実行する必要があります。
 */
function runOneTimeForAuthentication() {
  FormApp.getActiveForm();
}

/**
 * @param {Record<string, string>} formData 
 */
function sendFormDataToAPI(formData) {
  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    payload: JSON.stringify(formData),
  };

  try {
    UrlFetchApp.fetch(API_URL, options);
  } catch (error) {
    console.error("Error sending form data to API:", error);
  }
}

function extractFormData(e) {
  const formData = {};
  for (const [key, value] of Object.entries(e.namedValues)) {
    formData[key] = value.join(", "); // Google FormsのnamedValuesは配列なので、最初の要素を使用
  }
  return formData;
}

/**
 * Google Formsの送信イベントに対するトリガー関数です。
 * フォームが送信されると、この関数が呼び出され、フォームのデータがAPIに送信されます。
 * @param {Record<string, string>} e 
 */
function onFormSubmit(e) {
  const formData = extractFormData(e);
  sendFormDataToAPI(formData);
  console.log("Form data sent to API:", formData);
}