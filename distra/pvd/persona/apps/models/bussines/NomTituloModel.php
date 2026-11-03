<?php

/**
 * Class NomTituloModel
 */
class NomTituloModel extends ZendExt_Model
{

    protected $objTitle;
    protected $config;

    function __construct()
    {
        $this->objTitle = new NomTitulo();
        $this->config = new ConfiguracionGeneralService();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener los militancia activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return abjectArray
     * @throws Exception
     */
    public function getTitleActive($filtro, $limit, $start,$idtitulo = null,$value /*$filtro = null,$limit = null, $start = 0,*/)
    {
        try {
            $tmp->data = $this->objTitle->getTitleActive($filtro, $limit, $start,$idtitulo,$value);
          /* foreach($tmp->data as $k=>$v){
                $arrEspec = $this->config->getEspecialidadPorId($v['idespecialidad']);
                print_r($arrEspec);die;
                $tmp->data[$k]['especialidad']=$arrEspec;
            }*/
            $tmp->quantity = $this->objTitle->getCantTitleActive($filtro);


            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar Social stratification
     *
     * @param object $objskincolor
     *
     * @return numeric
     */
    public function addTitle($objTitle)
    {
        try {
            $objDomain = new NomTitulo();
            if (!$objDomain->findByIdOrDenom($objTitle->denominacion)) {
                $obj = new NomTitulo();
                foreach ($objTitle as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idtitulo;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para maodificar condecoracion
     *
     * @param numeric $idtitulo
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modTitle(
        $idtitulo, $denominacion, $abr, $descripcion, $fdesde, $fhasta, $idniveleducacional, $idespecialidad = null,
        $codigo
    )
    {
        try {
            $objDomain = new NomTitulo();
            $result = $objDomain->modTitle(
                $idtitulo, $denominacion, $abr, $descripcion, $fdesde, $fhasta, $idniveleducacional, $idespecialidad, $codigo
            );
            if ($result) {
                return $result;
            } else {
                return false;
            }

        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    /**
     * Funcion para eliminar Social stratification
     *
     * @param array $arrids
     *
     * @return value
     */
    public function delTitle($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTitulo');
//            if (is_array($ids)) {
//                $query->whereIn('idtitulo', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idtitulo = ?', $arrids);
            }
            $result = $query->execute();

            return $result->delete();
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                $r->exception = 1;

                return $r;
            } else {
                return (json_encode($e->getMessage()));
            }
        }
    }

    public function getRoot($id)
    {
        $root = $this->config->getEspecialidadesArbol($id);
        $array = array();
        foreach ($root as $v) {
            $p = count($array);
            $array[$p]->id = $v['idespecialidad'];
            $array[$p]->text = $v['denespecialidad'];
            $array[$p]->_parent = $v['idpadre'];
            $array[$p]->expanded = false;
            $array[$p]->iconCls = 'agrupador';
            $array[$p]->tipo = 'agrupador';
            $array[$p]->children = $this->getEspecialidades($v['idespecialidad']);
        }

        return $array;
    }

    public function getEspecialidades($id, $ext = false)
    {
        $arrEspec = $this->config->getEspecialidadesArbol($id);
        $array = array();
        foreach ($arrEspec as $v) {
            $p = count($array);
            $array[$p]->id = $v['idespecialidad'];
            $array[$p]->text = $v['denespecialidad'];
            $array[$p]->_parent = $v['idpadre'];
            $array[$p]->iconCls = 'tag_blue';
            $array[$p]->tipo = 'hoja';
            $array[$p]->leaf = true;
            $array[$p]->expanded = false;
        }

        return $array;
    }

}

