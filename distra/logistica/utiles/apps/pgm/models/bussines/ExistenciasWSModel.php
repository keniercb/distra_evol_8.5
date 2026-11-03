<?php

/**
 * Description of ExistenciasWSModel
 *
 * @author Kenier
 */
class ExistenciasWSModel extends BaseModel
{

    private $dirWS, $wsClient ,$factoryWS;

    function __construct()
    {
        parent::__construct(true);
        $config_ini = parse_ini_file("wsconfig.ini");
        $this->dirWS = $config_ini['WS_MTH'] == 'rest' ? $config_ini['URL_WS_REST'] : $config_ini['URL_WS_SOAP'];
        $this->factoryWS = new WSClient();

    }

    public function cargarExistencias($parametros = array())
    {
        try {
            switch ($parametros['query_store']) {
                case 'MA':
                    return $this->factoryWS->devolverMediosAlmacenados($parametros['idEspecialidad'],
                        $parametros['criterio'], $parametros['idEntidad'], $parametros['idIndicador'],
                        $parametros['start'], $parametros['limit']
                    );
                case 'ME':
                    $datos = $this->factoryWS->devolverActivos($parametros['idEspecialidad'],
                        $parametros['criterio'], $parametros['idEntidad'],
                        $parametros['idIndicador'], $parametros['start'], $parametros['limit']
                    );
                    $datosEntidades = $this->factoryWS->devolverEntidadesActivos($parametros['idEspecialidad'],
                        $parametros['criterio'], $parametros['idEntidad'],
                        $parametros['idIndicador'], $parametros['start'], $parametros['limit']
                    );
                    foreach ($datos->datos as $pos => $prod) {
                        $idarea = $prod->arearesp;
                        $datos->datos[$pos]->arearesp = $datosEntidades->datos->$idarea;
                    }
                    return $datos;
                case 'SURT':
                    return $this->factoryWS->devolverSurtidos($parametros['idEspecialidad'],
                        $parametros['query'], $parametros['start'], $parametros['limit']
                    );
                case 'ALM':
                    return $this->devolverEntidades($parametros['idEntidad']);
                case 'ESP':
                    return $this->devolverEspecialidades($parametros['idEntidad']);
            }
        } catch (SoapFault $e) {
            echo $this->wsClient->__getLastRequest();
            echo PHP_EOL;
            echo $this->wsClient->__getLastResponse();
            print_r($e);
            die();
        } catch(Exception $e){
            echo $e->getMessage();
            echo PHP_EOL;
            print_r($e);
            die();
        }
    }

    public function devolverEntidades($idEntidad)
    {
        $idEntidadSearch = is_array($idEntidad) ? implode(',', $idEntidad) : $idEntidad;
        $sqlEntidad = "SELECT e.idestructura as id, e.denominacion as denom from mod_estructuracomp.dat_estructura e " .
            "WHERE e.idestructura IN ($idEntidadSearch)";
        return array(
            'datos' => LogisticaDoctrineHelper::__init()->getConnection()
                ->execute($sqlEntidad)->fetchAll(PDO::FETCH_ASSOC)
        );
    }

    public function devolverEspecialidades($idEntidad)
    {

        $idEntidadSearch = is_array($idEntidad) ? implode(',', $idEntidad) : $idEntidad;
        $sqlEspec = "SELECT distinct es.idespecialidad as id,es.denespecialidad as denom "
            . "from mod_estructuracomp.dat_estructura e INNER JOIN mod_datosmaestros.nom_especialidad es" .
            " ON es.idespecialidad = e.idespecialidad WHERE e.idestructura IN ($idEntidadSearch)";
        return array(
            'datos' => LogisticaDoctrineHelper::__init()->getConnection()
                ->execute($sqlEspec)->fetchAll(PDO::FETCH_ASSOC)
        );
    }

    /**
     * @return mixed
     */
    public function getDirWS()
    {
        return $this->dirWS;
    }

    /**
     * @return SoapClient
     */
    public function getWsClient()
    {
        return $this->factoryWS;
    }


}
