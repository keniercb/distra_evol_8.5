<?php
class TpvApiService extends ApiHelper implements ISingletonClass{

    const UPLOAD_PLU_COMMAND = 'eS2iq9',
          DOWNLOAD_PLU_COMMAND = 'lMXe5Q',
          DOWNLOAD_PLU_TENDER_COMMAND = 'S2iq9e',
          DOWNLOAD_WEKLY_PLU_COMMAND = 'DwyoEmy',
          UPLOAD_CLERK_COMMAND = '9oAyd',
          DOWNLOAD_CLERK_COMMAND = 'OemN3',
          DOWNLOAD_DEP_COMMAND = 'ydwOem',
          UPLOAD_DEP_COMMAND = 'mOeydw',
          DOWNLOAD_AUDT_TAPE_COMMAND = 'yoEmyDw',
          DOWNLOAD_AUDT_TAPE_COMMAND_ANDROID = 'yoEmyDwA',
          DOWNLOAD_TOTALS_COMMAND = 'yoDwEmy',
          DELETE_SALES_COMMAND = 'iq9eS2',
          DELETE_SALES_PLU_COMMAN = '9eiqS2',
          NONE = 'NONE';

    private static $instance = null;
    private $apiToken;
    private $apiURL;
    /**
     * @return DistraApiHelper
     */
    public static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new TpvApiService;
        }
        return self::$instance;
    }

    public function setApiUrl($newUrl)
    {
        $this->apiURL = $newUrl;
    }

    public function authenticate($user, $password)
    {
        $data = http_build_query(array(
            'username' => $user,
            'password' => $password,
        ));

        $header = array(
            'Accept: application/json'
        );
        $tokenData = $this->execute($this->apiURL . 'login', $data, $header);
        $this->apiToken = $tokenData['type'] . ' ' . $tokenData['token'];
        return $this->apiToken;
    }

    public function exceuteCommand($command = TpvApiService::NONE , $params = array()){
        $params = is_array($params) ? json_encode($params) : $params;
        $isValidCommand = in_array($command, array(
            TpvApiService::DOWNLOAD_CLERK_COMMAND,
            TpvApiService::UPLOAD_PLU_COMMAND,
            TpvApiService::DOWNLOAD_PLU_COMMAND,
            TpvApiService::DOWNLOAD_PLU_TENDER_COMMAND,
            TpvApiService::UPLOAD_CLERK_COMMAND,
            TpvApiService::DOWNLOAD_DEP_COMMAND,
            TpvApiService::UPLOAD_DEP_COMMAND,
            TpvApiService::DOWNLOAD_AUDT_TAPE_COMMAND,
            TpvApiService::DOWNLOAD_AUDT_TAPE_COMMAND_ANDROID,
            TpvApiService::DELETE_SALES_COMMAND,
            TpvApiService::DOWNLOAD_WEKLY_PLU_COMMAND,
            TpvApiService::DOWNLOAD_TOTALS_COMMAND,
            TpvApiService::DELETE_SALES_PLU_COMMAN,
        ));
        if($isValidCommand == false){
            throw new Exception('You must provide a valid command');
        }
        $header = array(
            'Accept: application/json',
            'Content-Type: application/json',
            //'Authorization: ' . $token
        );
        try {
            $data = $this->execute($this->apiURL . "/exec/{$command}", $params, $header);
            return $data;
        } catch (Exception $e) {
            throw $e;
        }
    }
}