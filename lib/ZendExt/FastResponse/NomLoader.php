<?php
/**
 * ZendExt_FastResponse_NomLoader
 *
 * Nomenclador
 *
 * @author     : Omar Antonio Diaz Peña
 * @package    : ZendExt
 * @subpackage ZendExt_FastResponse
 * @copyright  : UCID-ERP Cuba
 * @version    1.0-0
 */
class ZendExt_FastResponse_NomLoader extends ZendExt_FastResponse_AbstractPDONomLoader
{
    /**
     * Consulta para obtener los datos del nomenclador
     *
     * @var string
     */
    private $query;

    /**
     * ZendExt_FastResponse_NomLoader
     *
     * Constructor de la clase
     *
     * @param string $pQuery - Consulta para obtener los del nomenclador
     * @param array  $pParamq - valores para formar el where de las consultas asociadas
     *
     * @return void
     */
    public function ZendExt_FastResponse_NomLoader($pQuery, $pParamq = array())
    {
        $this->query = $pQuery;
        if ($pParamq) {
            $this->parameter = $pParamq;
        }
        parent::Connect();
        $this->Load();
    }

    /**
     * Load
     *
     * Carga los datos del nomenclador.
     *
     * @throws ZendExt_Exception - excepciones declaradas en el xml de excepciones
     * @return void
     */
    public function Load()
    {
        $sql = $this->query;
        $conn = parent::getConn();
        $param = $this->parameter; //parametros de la consulta a ejecutar
        $query = $conn->prepare($sql);
        $query->execute(
            ($this->parameter) ? array_values($this->parameter) : null
        ); //le paso los parametros para cargarlos en las condiciones del sql formado
        $result = $query->fetchAll(PDO::FETCH_ASSOC);

        $this->data = $result;
    }
}
