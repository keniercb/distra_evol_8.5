<?php

/**
 * Class DatAfeccionModel
 */
class DatEstadoviviendaModel extends ZendExt_Model
{
    /**
     * @var
     */
    protected $objEstadovivienda;

    /**
     * @var
     */
    private $response;

    /**
     *
     */
    function __construct()
    {
        $this->objEstadovivienda = new DatEstadovivienda();
    }

    /**
     *
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param $idpersona
     * @param $filtro
     * @param $limit
     * @param $start
     *
     * @return mixed
     * @throws Exception
     */
    public function getEstadoViviendaByPersona($idpersona)
    {

        try {

            $this->response->data = DatEstadovivienda::getEstadoViviendaByPersona($idpersona);

            return $this->response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addEstadoVivienda($idconvivencia, $idestadovivienda, $idpersona)
    {

        try {
            $obj = new DatEstadovivienda();
            $obj->idconvivencia = $idconvivencia;
            $obj->idestadovivienda = $idestadovivienda;
            $obj->idpersona = $idpersona;
            $obj->save();

        } catch (Doctrine_Collection_Exception $e) {

            throw $e;
        }
    }

    public function modEstadoVivienda($idestadoviviendap, $idconvivencia, $idestadovivienda, $idpersona)
    {

        try {
            $nuevo = new DatEstadovivienda();
            $obj = $nuevo->getById($idestadoviviendap);
            $obj->idconvivencia = $idconvivencia;
            $obj->idestadovivienda = $idestadovivienda;
            $obj->idpersona = $idpersona;
            $obj->save();

        } catch (Doctrine_Collection_Exception $e) {

            throw $e;
        }
    }

    public function getEntidad($idestructura)
    {
        $result = DatEstadovivienda::getEntidad($idestructura);
        foreach ($result as $key => $ue) {
            $result[$key] = $ue['idestructura'];
        }
        return $result;
    }

    public function getCantPersonaByEstado($idestructura) //grafica
    {
        $result = array();
        $entities = $this->getEntidad($idestructura);
        $entitesPersons = DatEstadovivienda::getDatos($entities);
        $conivencia = NomConvivencia::getConvivencia(null, null, null);
        // $estadovivienda = NomEstadovivienda::getEstadoVivienda(null, null, null);
//        print_r($entities);
//        die;

        //print_r($conivencia);die;
        $entitiesaux = array();
        foreach ($entities as $i => $ident) {
            $estrucDenom = ZendExt_IoC::getInstance()->metadatos->DameEstructura($ident);
//            print_r($estrucDenom[0]->denominacion);
//           die;
            //$entities['id'] = $ident;;
            $entitiesaux[$i]['id'] = $ident;
            $entitiesaux[$i]['denominacion'] = $estrucDenom[0]->denominacion;
        }
//        print_r($entitiesaux);
//        die;

        foreach ($conivencia as $c => $conv) {

            array_push($result, array(
//                'identidad' => $ident,
                'name' => $conv['denominacion'],
                'data' => array()
            ));

            foreach ($entitiesaux as $key => $ident) {
                // print_r($ident);die;
               // $estrucDenom = ZendExt_IoC::getInstance()->metadatos->DameEstructura($ident)[0]->denominacion;
                $result[$c]['data'][$ident][0] = $ident['denominacion'];
                $result[$c]['data'][$ident][1] = 0;


                foreach ($entitesPersons as $entipe) {
                   // print_r($entipe);die;
                    if ($entipe['idconvivencia'] == $conv['idconvivencia'] && $ident['id']== $entipe['ueb']) {
                        $result[$c]['data'][$ident][1] += 1;


                    }

                }

            }

        }

        $objreturn->datosgraficar = $result;
        $objreturn->arrayentidades = $entitiesaux;
       // print_r($objreturn);die;
        return $objreturn;
    }

    public
    function personabyEstado($idestructura)
    {
        $entities = $this->getEntidad($idestructura);
        $entitesPersons = DatEstadovivienda::getDatos($entities);

        foreach ($entitesPersons as &$person) {
            $person['ueb'] = ZendExt_IoC::getInstance()->metadatos->DameEstructura($person['ueb'])[0]->denominacion;
            $personInfo = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(array($person['idpersona']), null, null, null, null, null);
            $person['nombreyapellidos'] = $personInfo->data[0]['nombreapellidos'];
            $person['numid'] = $personInfo->data[0]['numid'];
            $person['cargo'] = $personInfo->data[0]['denomcargo'];
        }
        $this->response->data = $entitesPersons;
        $this->response->quantity = count($entitesPersons);
        return $this->response;


    }

}

