<?php

class RecuperacionesModel extends BaseModel
{

    public function __construct($datos = array())
    {
        parent::__construct($datos);

    }
    /**
     * Una instancia unica de RecuperacionesModel
     *
     * @var RecuperacionesModel
     */
    private static $instance = null;

    /**
     * Creates a new instance of class RecuperacionesModel
     *
     * @return RecuperacionesModel
     */
    public static function getInstance()
    {
        if (null === self::$instance) {
            self::$instance = new self;
        }
        return self::$instance;
    }

    public function executeQuery($params = array())
    {
        $sql = "SELECT * FROM {$params['sql']}";
        if($params['data']){
            $filter = implode('AND',$params['data']);
            $sql = " WHERE " . $filter;
        }
        $conn = Zend_Registry::get('conexion');
        return array(
            'cantidad' => $conn->execute($sql)->rowCount(),
            'datos' => $conn->execute($sql . " LIMIT {$params['limit']} OFFSET {$params['start']}")->fetchAll(PDO::FETCH_ASSOC)
        );
    }
}