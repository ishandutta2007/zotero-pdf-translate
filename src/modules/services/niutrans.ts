import { getPref } from "../../utils/prefs";
import { TranslateTaskProcessor } from "../../utils/task";

export default <TranslateTaskProcessor>async function (data) {
  const apikey = data.secret;
  const dictNo = getPref("niutransDictNo");
  const memoryNo = getPref("niutransMemoryNo");
  const endpoint =
    getPref("niutransEndpoint") || "https://niutrans.com/niuInterface";
  const xhr = await Zotero.HTTP.request(
    "POST",
    `${endpoint}/textTranslation?pluginType=zotero&apikey=${apikey}`,
    {
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/plain, */*",
      },
      body: JSON.stringify({
        from: data.langfrom.split("-")[0],
        to: data.langto.split("-")[0],
        termDictionaryLibraryId: dictNo,
        translationMemoryLibraryId: memoryNo,
        // TEMP: implement realmCode in settings
        realmCode: 99,
        source: "zotero",
        src_text: data.raw,
        caller_id: data.callerID,
      }),
      responseType: "json",
    },
  );

  if (xhr?.status !== 200) {
    throw `Request error: ${xhr?.status}`;
  }

  if (xhr.response.code !== 200) {
    throw `Service error: ${xhr.response.code}:${xhr.response.msg}`;
  }
  data.result = xhr.response.data.tgt_text;
};
