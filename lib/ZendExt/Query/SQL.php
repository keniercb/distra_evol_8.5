<?php
/**
 * Clase utilizada para formar y ejecutar una consulta SQL (Lenguaje de consulta de Sauxe).
 *
 * @author Yoandry Morejon Borbon
 * @package ZendExt
 * @subpackage Query
 * @category Framework.
 * @uses Doctrine_Connection, Doctrine_Manager.
 * @copyright UCID
 * @version 1.0-0
 */
class ZendExt_Query_SQL {

	protected $_sql = array(
		'select' => array(),
		'from' => array(),
		'join' => array(),
		'where' => array(),
		'having' => array(),
		'orderby' => array(),
		'groupby' => array(),
		'limit' => 0,
		'offset' => 0,
	);
	
	protected $_sqlSchema = array(
		'select' => 'SELECT',
		'from' => 'FROM',
		'join' => 'JOIN',
		'where' => 'WHERE',
		'having' => 'HAVING',
		'orderby' => 'ORDER BY',
		'groupby' => 'GROUP BY',
		'limit' => 'LIMIT',
		'offset' => 'OFFSET'
	);
	
	protected $_params = array();
	
	protected $conn;
	
	/**
	 * Constructor de la clase.
	 * 
	 * @param Doctrine_Connection $conn - Objeto conexion.
	 */
	public function __construct(Doctrine_Connection $conn = null) {
		if (is_null($conn))
			$this->conn = Doctrine_Manager::getInstance()->getCurrentConnection();
		else
			$this->conn = $conn;
	}
	
	/**
	 * Crear una instancia de la clase.
	 * 
	 * @param Doctrine_Connection $conn - Objeto conexion.
	 * @return ZendExt_Query_SQL - Instancia de la clase.
	 */
	public static function create(Doctrine_Connection $conn = null) {
		return new self($conn);
	}

	/**
	 * Adiciona una sentencia sql al select a la consulta.
	 * 
	 * @param string $_select - Sentencia sql.
	 * @return ZendExt_Query_SQL - Instancia de la clase.
	 */
	public function select($_select) {
		array_push($this->_sql['select'], $_select);
		return $this;
	}
	
	/**
	 * Adiciona una sentencia sql al select a la consulta.
	 * 
	 * @param string $_select - Sentencia sql.
	 * @return ZendExt_Query_SQL - Instancia de la clase.
	 */
	public function addSelect($_select) {
		array_push($this->_sql['select'], $_select);
		return $this;
	}

	/**
	 * Adiciona una setencia sql al from de la consulta.
	 * 
	 * @param string $_from - Sentencia sql.
	 * @return ZendExt_Query_SQL - Instancia de la clase.
	 */
	public function from($_from) {
		array_push($this->_sql['from'], $_from);
		return $this;
	}

	/**
	 * Adiciona una sentencia sql join a la consulta.
	 * 
	 * @param string $_table - Tabla destino.
	 * @param string $_conditions - Condiciones del join.
	 * @param string $_type - Tipo de join (LEFT, INNER, RIGHT, LEFT OUTER, RIGHT OUTER, FULL).
	 * @param mixed $_params - Parametros del join.
	 * @return ZendExt_Query_SQL - Instancia de la clase.
	 */
	public function join($_table, $_conditions, $_type = 'LEFT', $_params = null) {
		$join = array(
			'sql' => "$_table ON ($_conditions)",
			'type' => $_type,
			'params' => $_params
		);
		array_push($this->_sql['join'], $join);
		return $this;
	}
	
	/**
	 * Adiciona una sentencia sql inner join a la consulta.
	 * 
	 * @param string $_join - Sentencia sql del join.
	 * @param mixed $_params - Parametros del join.
	 * @return ZendExt_Query_SQL - Instancia de la clase.
	 */
	public function innerJoin($_join, $_params = null) {
		$join = array(
			'sql' => "$_join",
			'type' => "INNER",
			'params' => $_params
		);
		array_push($this->_sql['join'], $join);
		return $this;
	}
	
	/**
	 * Adiciona una sentencia left join a la consulta.
	 * 
	 * @param string $_join - Sentencia sql del join.
	 * @param mixed $_params - Parametros del join.
	 * @return ZendExt_Query_SQL - Instancia de la clase.
	 */
	public function leftJoin($_join, $_params = null) {
		$join = array(
			'sql' => "$_join",
			'type' => "LEFT",
			'params' => $_params
		);
		array_push($this->_sql['join'], $join);
		return $this;
	}

	/**
	 * Adiciona una sentencia sql para filtrar la consulta.
	 * 
	 * @param string $_where - Sentencia sql.
	 * @param mixed $_params - Parametros del where.
	 * @return ZendExt_Query_SQL - Instancia de la clase.
	 */
	public function where($_where, $_params = null) {
		$where = array(
			'sql' => $_where,
			'params' => $_params
		);
		array_push($this->_sql['where'], $where);
		return $this;
	}
	
	/**
	 * Adiciona una sentencia sql para filtrar la consulta.
	 * 
	 * @param string $_where - Sentencia sql.
	 * @param mixed $_params - Parametros del where.
	 * @return ZendExt_Query_SQL - Instancia de la clase.
	 */
	public function addWhere($_where, $_params = null) {
		$where = array(
			'sql' => $_where,
			'params' => $_params
		);
		array_push($this->_sql['where'], $where);
		return $this;
	}

	/**
	 * Especifica la setencia sql de ordenamiento de la consulta.
	 * 
	 * @param string $_orderBy - Campos por los que se desea ordenar separados por comas.
	 * @param string $_type - Tipo de ordenamiento (ASC o DESC)
	 * @return ZendExt_Query_SQL - Instancia de la clase.
	 */
	public function orderBy($_orderBy, $_type) {
		array_push($this->_sql['orderby'], " $_orderBy $_type");
		return $this;
	}

	/**
	 * Especifica la setencia sql de agrupamiento de la consulta.
	 * 
	 * @param string $_groupBy - Campos por los que se desea agrupar separados por comas.
	 * @return ZendExt_Query_SQL - Instancia de la clase.
	 */
	public function groupBy($_groupBy) {
		array_push($this->_sql['groupby'], $_groupBy);
		return $this;
	}

	/**
	 * Adiciona una sentencia sql para filtrar la consulta utilizando funciones agregadas.
	 * 
	 * @param string $_having - Sentencia sql.
	 * @param mixed $_params - Parametros del having.
	 * @return ZendExt_Query_SQL - Instancia de la clase.
	 */
	public function having($_having, $_params) {
		$having = array(
			'sql' => $_having,
			'params' => $_params
		);
		array_push($this->_sql['having'], $having);
		return $this;
	}

	/**
	 * Especifica la setencia sql del limite de la consulta.
	 * 
	 * @param numeric $_limit - limite de la consulta.
	 * @return ZendExt_Query_SQL - Instancia de la clase.
	 */
	public function limit($_limit) {
		$this->_sql['limit'] = $_limit;
		return $this;
	}

	/**
	 * Especifica la setencia sql de la posicion a partir de la cual se limitara la consulta.
	 * 
	 * @param numeric $_limit - posicion a partir de la cual se limitara la consulta.
	 * @return ZendExt_Query_SQL - Instancia de la clase.
	 */
	public function offset($_offset) {
		$this->_sql['offset'] = $_offset;
		return $this;
	}
	
	/**
	 * Adiciona un parametro o un arreglo de parametros a listado de parametros de la consulta.
	 * 
	 * @param mixed $_params - Parametros de la consulta.
	 */
	protected function addParams($_params) {
		if ($_params != null) {
			if (is_array($_params))
				$this->_params = array_merge($this->_params, $_params);
			else
				array_push($this->_params, $_params);
		}
	}

	/**
	 * Devuelve la sentencia sql.
	 * 
	 * @return string - Sentencia sql de la consulta.
	 */
	public function getSQL() {
		$querySql = '';
		foreach ($this->_sqlSchema as $key => $sqlSchema) {
			switch ($key) {
				case ($key == 'select' && count($this->_sql['select'])):
				case ($key == 'from' && count($this->_sql['from'])):
						$querySql .= $sqlSchema . ' ' . implode(', ', $this->_sql[$key]);
					break;
				case ($key == 'where' && count($this->_sql['where'])): 
				case ($key == 'having' && count($this->_sql['having'])):
						$sqlWh = '';
						$ini = '';
						$in = '';
						$end = '';
						if (count($this->_sql[$key]) > 1) {
							$ini = '(';
							$in = ') AND (';
							$end = ')';
						}
						foreach ($this->_sql[$key] as $wh) {
							if ($sqlWh != '')
								$sqlWh .= $in;
							$sqlWh .= "{$wh['type']} {$wh['sql']} ";
							$this->addParams($wh['params']);
						}
						$querySql .= $sqlSchema . $ini . $sqlWh . $end;
					break;
				case ($key == 'join' && count($this->_sql['join'])):
						foreach ($this->_sql['join'] as $join) {
							$querySql .= " {$join['type']} {$sqlSchema} {$join['sql']}";
							$this->addParams($join['params']);
						}
					break;
				case ($key == 'orderby' && count($this->_sql['orderby'])):
				case ($key == 'groupby' && count($this->_sql['groupby'])):
						$querySql .= $sqlSchema . implode(', ', $this->_sql[$key]);
					break;
				case ($key == 'limit' && $this->_sql['limit']):
				case ($key == 'offset' && $this->_sql['limit']):
						$querySql .= $sqlSchema . $this->_sql[$key];
					break;
			}
			$querySql .= ' ';
		}
		return $querySql;
	}

	/**
	 * Ejecuta la sentencia sql.
	 * 
	 * @return PDOStatement|Doctrine_Adapter_Statement
	 */
	public function execute() {
		$sql = $this->getSQL();
		return $this->conn->execute($sql, $this->_params);
	}

	/**
	 * Ejecuta la sentencia sql devolviendo todos los datos.
	 * 
	 * @return array - Arreglo de datos.
	 */
	public function fetchAll() {
		$sql = $this->getSQL();
		return $this->conn->fetchAll($sql, $this->_params);
	}
	
	/**
	 * @access public
	 */
	public function fetchArray() {
		$sql = $this->getSQL();
		return $this->conn->fetchArray($sql, $this->_params);
	}
	
	/**
	 * @access public
	 */
	public function fetchAssoc() {
		$sql = $this->getSQL();
		return $this->conn->fetchAssoc($sql, $this->_params);
		
	}
	
	/**
	 * @access public
	 */
	public function fetchBoth() {
		$sql = $this->getSQL();
		return $this->conn->fetchBoth($sql, $this->_params);
	}
	/**
	 * @access public
	 */
	public function fetchColumn() {
		$sql = $this->getSQL();
		return $this->conn->fetchColumn($sql, $this->_params);
	}
	/**
	 * @access public
	 */
	public function fetchOne() {
		$sql = $this->getSQL();
		return $this->conn->fetchOne($sql, $this->_params);
	}
	/**
	 * @access public
	 */
	public function fetchRow() {
		$sql = $this->getSQL();
		return $this->conn->fetchRow($sql, $this->_params);
	}
	
	/**
	 * Devuelve la sentencia sql del select de permisos.
	 * 
	 * @param bool $selectLabel - Especifica el uso de la etiqueta SELECT al inicio del SQL.
	 * @return string - Sentencia sql de la consulta.
	 */
	public function getSQLSelect($selectLabel = true) {
		$querySql = '';
		if (count($this->_sql['select'])) {
			if ($selectLabel)
				$querySql .= $this->_sqlSchema['select'] . ' ' . implode(', ', $this->_sql['select']);
			else $querySql .= ' ' . implode(', ', $this->_sql['select']);
		}
		return $querySql;
	}
	
	/**
	 * Devuelve la sentencia sql de los join de compartimentacion.
	 * 
	 * @return string - Sentencia sql de la consulta.
	 */
	public function getSQLJoin() {
		$querySql = '';
		if (count($this->_sql['join']))
			foreach ($this->_sql['join'] as $join) {
				$querySql .= " {$join['type']} {$this->_sqlSchema['join']} {$join['sql']}";
				$this->addParams($join['params']);
			}
		return $querySql;
	}
	
	/**
	 * Devuelve la sentencia sql del where de compartimentacion.
	 * 
	 * @param bool $whereLabel - Especifica el uso de la etiqueta WHERE al inicio del SQL del where.
	 * @return string - Sentencia sql de la consulta.
	 */
	public function getSQLWhere($whereLabel = true) {
		$querySql = '';
		if (count($this->_sql['where'])) {
			$sqlWh = '';
			$ini = '';
			$in = '';
			$end = '';
			if (count($this->_sql['where']) > 1) {
				$ini = '(';
				$in = ') AND (';
				$end = ')';
			}
			foreach ($this->_sql['where'] as $wh) {
				if ($sqlWh != '')
					$sqlWh .= $in;
				$sqlWh .= "{$wh['type']} {$wh['sql']} ";
				$this->addParams($wh['params']);
			}
			if ($whereLabel)
				$querySql .= $this->_sqlSchema['where'] . $ini . $sqlWh . $end;
			else $querySql .= ' ' . $ini . $sqlWh . $end;
		}
		return $querySql;
	}
	
	/**
	 * Retorna los parametros de compartimentacion (evita inyeccion de codigo SQL);
	 * 
	 * @return array - Parametros de compartimentacion.
	 */
	public function getParams() {
		return $this->_params;
	}
}
