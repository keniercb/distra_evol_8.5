<?php

/**
 * Programador de tareas.
 * @class TaskProgramerModel
 * @package Logistica
 * @subpackage TaskProgramer
 * @author Dainier Aguila Medina
 * @copyright (c) 2017, XETID
 * @version 1.0
 */
class TaskProgramerModel extends BaseModel
{

    protected $dbserver;
    protected $dbname;
    protected $dbport;
    protected $dbuser;
    protected $dbpass;
    protected $task_apiaddress;

    public function __construct()
    {
        parent::__construct();
        $apiSql = "select nv.valor from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'TASK_APIADDRESS'";
        $apiValue = LogisticaDoctrineHelper::__init()->getConnection()->execute($apiSql)->fetchAll(PDO::FETCH_ASSOC);
        if (count($apiValue) > 0) {
            $this->task_apiaddress = str_replace('\'', '', $apiValue[0]['valor']);
        }

        $serverSql = "select nv.valor from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'TASK_DBSERVER'";
        $serverValue = LogisticaDoctrineHelper::__init()->getConnection()->execute($serverSql)->fetchAll(PDO::FETCH_ASSOC);
        if (count($serverValue) > 0) {
            $this->dbserver = str_replace('\'', '', $serverValue[0]['valor']);
        }

        $nameSql = "select nv.valor from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'TASK_DBNAME'";
        $nameValue = LogisticaDoctrineHelper::__init()->getConnection()->execute($nameSql)->fetchAll(PDO::FETCH_ASSOC);
        if (count($nameValue) > 0) {
            $this->dbname = str_replace('\'', '', $nameValue[0]['valor']);
        }

        $portSql = "select nv.valor from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'TASK_DBPORT'";
        $portValue = LogisticaDoctrineHelper::__init()->getConnection()->execute($portSql)->fetchAll(PDO::FETCH_ASSOC);
        if (count($portValue) > 0) {
            $this->dbport = str_replace('\'', '', $portValue[0]['valor']);
        } else {
            $this->dbport = 5432;
        }

        $userSql = "select nv.valor from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'TASK_DBUSER'";
        $userValue = LogisticaDoctrineHelper::__init()->getConnection()->execute($userSql)->fetchAll(PDO::FETCH_ASSOC);
        if (count($userValue) > 0) {
            $this->dbuser = str_replace('\'', '', $userValue[0]['valor']);
        } else {
            $this->dbuser = 'zeolides';
        }

        $passSql = "select nv.valor from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'TASK_DBPASS'";
        $passValue = LogisticaDoctrineHelper::__init()->getConnection()->execute($passSql)->fetchAll(PDO::FETCH_ASSOC);
        if (count($passValue) > 0) {
            $this->dbpass = str_replace('\'', '', $passValue[0]['valor']);
        } else {
            $this->dbpass = 'zeolides*2012.,';
        }
    }

    /**
     * Devuelve un arreglo de tareas programadas.
     * @param array $filtro
     * @param boolean $dql [Opcional] Determina si se devuelve la consulta.
     * @return array|Doctrine_Query
     */
    public function cargarTareas($filtro, $dql = false)
    {
        $query = Doctrine_Query::create()
            ->select('t.*')
            ->from('DatTarea t')
            //->innerJoin('t.NomTarea nt')
            ->where('t.estado <> 3')
            ->orderBy('t.idtarea');
        if ($dql) {
            return $query;
        }
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray()
        );
    }

    /**
     * Adiciona o actualiza una tarea.
     * @param array $datos
     * @return boolean
     */
    public function adicionarTarea($datos)
    {
        $datos['identidad'] = $datos['identidad'] ? $datos['identidad'] : $this->global->Estructura->idestructura;
        $tarea = new DatTarea();
        if ($datos['idtarea']) {
            $tarea->assignIdentifier($datos['idtarea']);
        }
        $tarea->synchronizeWithArray($datos);
        $tarea->save();
        return true;
    }

    /**
     * Elimina una o varias tareas programadas.
     * @param array $idtareas
     * @return boolean
     */
    public function eliminarTarea($idtareas)
    {
        Doctrine_Query::create()->update('DatTarea')->set('estado', 3)->whereIn('idtarea', $idtareas)->execute();
        return true;
    }

    /**
     * Activa i desactiva una o varias tareas programadas.
     * @param array $idtarea
     * @param boolean $activar [Opcional]
     * @return boolean
     */
    public function activarTarea($idtarea, $activar = false)
    {
        $estado = $activar ? 2 : 1;
        $tareas = $query = Doctrine_Query::create()
            ->select('t.*')
            ->from('DatTarea t')
            ->whereIn('t.idtarea', $idtarea)->fetchArray();

        foreach ($tareas as $t) {
            if ($activar) {
                $sendTask = array(
                    'task_name' => $t['denominacion'],
                    'task_code' => $t['code'],
                    'task_data'=>array(
                        'dbserver'=>$this->dbserver,
                        'db'=>$this->dbname,
                        'dbport'=>$this->dbport,
                        'dbuser'=>$this->dbuser,
                        'dbpass'=>$this->dbpass,
                    ),
                    'cron_expression' => "{$t['min']} {$t['horas']} * * *"
                );
                $header = array(
                    'Accept: application/json',
                    'Content-Type: application/json'
                );
                $resp = $this->execute($this->task_apiaddress."/schedule", json_encode($sendTask), $header);//http://api.taskprogramer.javier.cu:3000

            }
        }
        Doctrine_Query::create()->update('DatTarea')->set('estado', $estado)->whereIn('idtarea', $idtarea)->execute();
        return true;
    }

    /**
     * Devuelve un arreglo de NomTarea.
     * @return array
     */
    public function cargarComboNomTareas()
    {
        //$query = Doctrine_Query::create()->from('NomTarea');
        $tasks = array(
            array('code' => 'download_orders', 'denominacion' => 'Descargar pedidos'),
            array('code' => 'download_audit', 'denominacion' => 'Descargar cinta auditora')
        );
        return array(
            'cantidad' => count($tasks), 'total' => count($tasks),
            'datos' => $tasks
        );
    }

    public function execute($url, $data, $header, $post = true, $method = 'POST', $debugInfo = false, $authorization = false)
    {
        $ch = curl_init();
        curl_setopt_array($ch, array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_HEADER => true,
            CURLOPT_HTTPHEADER => $header,
            CURLOPT_URL => $url,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_SSL_VERIFYHOST => 0
        ));

        if ($data) {
            curl_setopt_array($ch, array(
                CURLOPT_POSTFIELDS => $data
            ));
        }

        if ($post !== false && $method === 'POST') {
            curl_setopt_array($ch, array(
                CURLOPT_POST => true
            ));
        }
        if ($method === 'GET') {
            if ($authorization) {
                curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                    'Authorization: ' . $authorization
                ));
            }
            curl_setopt_array($ch, array(
                CURLOPT_HTTPGET => true
            ));
        }
        if ($method === 'PATCH') {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
        }
        $apiResponse = curl_exec($ch);
        if ($apiResponse === false) {
            die('Request Error:' . curl_error($ch));
        }
        $apiResponseInfo = curl_getinfo($ch);
        if ($debugInfo) {
            print_r($apiResponseInfo);
            die;
        }
        $pos = $apiResponseInfo['header_size'];
        /*stripos($apiResponse, '{');
        //$pos = stripos($apiResponse, '{');
        //$apiResponseHeader = trim(substr($apiResponse, 0, $pos));
        //$apiResponseBody  = $apiResponse;
        */
        $apiResponseBody = substr($apiResponse, $pos);
        curl_close($ch);
        return json_decode($apiResponseBody, true);
    }

}
