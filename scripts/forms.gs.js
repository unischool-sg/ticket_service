const env = PropertiesService.getScriptProperties();
const API_URL = env.getProperty("API_ENDPOINT");
const TOKEN = env.getProperty("API_KEY");

/**
 * この関数は、Google Formsのスクリプトエディタで一度だけ実行するための関数です。
 * これにより、Google FormsのAPIへの認証が行われ、フォームのデータをAPIに送信するためのアクセス権が得られます。
 * この関数は、Google Formsのスクリプトエディタで手動で実行する必要があります。
 */
function runOneTimeForAuthentication() {
  FormApp.getActiveForm();
}

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
    formData[key] = value.join(", "); // Google FormsのnamedValuesは配列なので、カンマ区切りで使用
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
  console.log("Form data sent to API");
}
