<?php
class ZendExt_File
{
	/**
	 * Default path to an entity
	 * @var string
	 * @access private
	 */
	private $path	= false;

	/**
	 * Constructor which allows to chose the path of the entity used for following actions
	 * @param string $path
	 */
	public function __construct($path = false)
	{
		$this->path = $path;
	}

	/**
	 * Methods which allows to chose the path of the entity used for following actions
	 * @param string $path
	 */
	public function set_path($path = false)
	{
		$this->path = $path;
	}

	/**
	 * Return the path of the entity used by default
	 * @return string
	 */
	public function get_path()
	{
		return $this->path;
	}

	/**
	 * Return the type of an entity
	 * @param string $path
	 * @return string
	 */
	public function type($path = null)
	{
		$this->test_var($path, $this->path);

		if (is_dir($path))
			return 'dir';

		else if (is_file($path))
			return 'file';

		else
			return false;
	}

	/**
	 * Return the list of all entity included in the path
	 * @param string $path
	 * @param boolean $withroot
	 * @return array
	 */
	public function ls($path = null, $withroot = true)
	{
		$this->test_var($path, $this->path);

		if (!is_dir($path))
			return false;
			
		$infos = array();

		if ($handle = opendir($path))
		{
			while (false !== ($file = readdir($handle)))
			{
				if ($file != '..' && $file != '.' && $file != '')
				{
					if ($withroot)
						$infos[] = $path.'/'.$file;

					else
						$infos[] = $file;
				}
			}

			closedir($handle);

			$infos = array_map(array($this, 'format_path'), $infos);

			return $infos;
		}
		else
		{
			return false;
		}
	}

	/**
	 * Return the list of directories included in the path
	 * @param string $path
	 * @param boolean $withroot
	 * @return array
	 */
	public function lsd($path = null, $withroot = true)
	{
		$this->test_var($path, $this->path);

		if (!is_dir($path))
			return false;

		$infos = array();

		if ($handle = opendir($path))
		{
			while (false !== ($file = readdir($handle)))
			{
				if (is_dir($path.'/'.$file))
				{
					if ($file != '..' && $file != '.' && $file != '')
					{
						if ($withroot)
							$infos[] = $path.'/'.$file;

						else
							$infos[] = $file;
					}
				}
			}

			$infos = array_map(array($this, 'format_path'), $infos);
			closedir($handle);

			return $infos;
		}
		else
		{
			return false;
		}
	}

	/**
	 * Return infos of all entity included in the path
	 * @param string $path
	 * @param boolean $withroot
	 * @return array
	 */
	public function ll($path = null, $withroot = true)
	{
		$this->test_var($path, $this->path);

		if (!is_dir($path))
			return false;

		if ($handle = opendir($path))
		{
			while (false !== ($file = readdir($handle)))
			{
				if ($file != '..' && $file != '.' && $file != '')
				{
					if ($withroot)
					{
						$temp = $this->format_path($path.'/'.$file);
						$infos[$temp] = $this->infos($temp);
					}
					else
					{
						$temp = $this->format_path($file);
						$infos[$temp] = $this->infos($path.'/'.$file);
					}
				}
			}

			closedir($handle);

			return $infos;
		}
		else
		{
			return false;
		}
	}

	/**
	 * Return infos of all directories included in the path
	 * @param string $path
	 * @param boolean $withroot
	 * @return array
	 */
	public function lld($path = null, $withroot = true)
	{
		$this->test_var($path, $this->path);

		if (!is_dir($path))
			return false;

		if ($handle = opendir($path))
		{
			while (false !== ($file = readdir($handle)))
			{
				if (is_dir($path.'/'.$file))
				{
					if ($file != '..' && $file != '.' && $file != '')
					{
						if ($withroot)
						{
							$temp = $this->format_path($path.'/'.$file);
							$infos[$temp] = $this->infos($temp);
						}
						else
						{
							$temp = $this->format_path($file);
							$infos[$temp] = $this->infos($path.'/'.$file);
						}
					}
				}
			}

			closedir($handle);

			return $infos;
		}
		else
		{
			return false;
		}
	}

	/**
	 * Create a file with or without content
	 * @param string $content
	 * @param string $path
	 * @return boolean
	 */
	public function mkfile($content = '', $path = null)
	{
		$this->test_var($path, $this->path);

		if ($handle = fopen($path, 'w+'))
		{
			if (strlen($content) != 0)
				fwrite($handle, $content);

			fclose($handle);

			return true;
		}
		else
		{
			return false;
		}
	}

	/**
	 * Read the content of a file
	 * @param string $path
	 * @param boolean $byline
	 * @param int $length
	 * @return string/array
	 */
	public function read_file($path = null, $byline = false, $length = 1024)
	{
		$this->test_var($path, $this->path);

		if (!is_file($path))
			return false;

		if ($byline)
		{
			if ($handle = fopen($path, 'r'))
			{
				while (!feof($handle))
					$lines[] = fgets($handle, $length);

				fclose($handle);

				return $lines;
			}
			else
				return false;
		}
		else
		{
			return file_get_contents($path);
		}
	}

	/**
	 * Create a directory with/without chmod
	 * @param string $path
	 * @param int $chmod
	 * @return boolean
	 */
	public function mkdir($path = null, $chmod = null)
	{
		$this->test_var($path, $this->path);

		if (@mkdir($path))
		{
			if (!is_null($chmod))
				chmod($path, $chmod);

			return true;
		}
		else
		{
			return false;
		}
	}

	/**
	 * Move a file or a directory
	 * @param string $path
	 * @param string $where
	 * @return boolean
	 */
	public function mv($path, $where)
	{
		if (!is_dir($where))
			return false;

		if (is_dir($path))
		{
			$tree = $this->tree($path);
			$this->cp($path, $where);
			$this->rm($tree);
		}
		else if (is_file($path))
		{
			$this->cp($path, $where);
			$this->rm($path);
		}

		return true;
	}

	/**
	 * Remove files or/and directories
	 * @param string $path
	 * @return boolean
	 */
	public function rm($path = null)
	{
		$this->test_var($path, $this->path);

		if (!is_array($path))
			$path = array($path);

		foreach ($path as $file)
		{
			if (is_dir($file))
			{
				$tree = $this->tree($file);
				rsort($tree);

				foreach ($tree as $f)
				{
					if (is_dir($f))
						rmdir($f);

					else if (is_file($f))
						unlink($f);
				}
			}
			else if (is_file($file))
			{
				unlink($file);
			}
			else
			{
				return false;
			}
		}

		return true;
	}

	/**
	 * Copy files or/and directories
	 * @param string $path
	 * @param string $where
	 * @return boolean
	 */
	public function cp($path, $where)
	{
		if (!is_dir($where))
			return false;

		if (!is_array($path))
			$path = array($path);

		foreach($path as $file)
		{
			if (is_file($file))
				copy($file, $where.'/'.$file);

			else if (is_dir($file))
			{
				$files = $this->tree($file);
				$this->mkdir($where.'/'.$file);

				foreach ($files as $f)
				{
					if (is_file($f))
						copy($f, $where.'/'.$f);
					else if (is_dir($f))
						$this->mkdir($where.'/'.$f);
				}
			}
		}

		return true;
	}

	/**
	 * Return the mod of a file/directory
	 * Credits goes to Ambriel_Angel (www dot ambriels dot net)
	 * @param string $path
	 * @return int
	 */
	public function mod($path)
	{
		$this->test_var($path, $this->path);

		// Initialisation
		$val	= 0;
		$perms	= fileperms($path);

		// Owner; User
		$val += (($perms & 0x0100) ? 0x0100 : 0x0000);		// Read
		$val += (($perms & 0x0080) ? 0x0080 : 0x0000);		// Write
		$val += (($perms & 0x0040) ? 0x0040 : 0x0000);		// Execute

		// Group
		$val += (($perms & 0x0020) ? 0x0020 : 0x0000);		// Read
		$val += (($perms & 0x0010) ? 0x0010 : 0x0000);		// Write
		$val += (($perms & 0x0008) ? 0x0008 : 0x0000);		// Execute

		// Global; World
		$val += (($perms & 0x0004) ? 0x0004 : 0x0000);		// Read
		$val += (($perms & 0x0002) ? 0x0002 : 0x0000);		// Write
		$val += (($perms & 0x0001) ? 0x0001 : 0x0000);		//	Execute

		// Misc
		$val += (($perms & 0x40000) ? 0x40000 : 0x0000);	// temporary file (01000000)
		$val += (($perms & 0x80000) ? 0x80000 : 0x0000); 	// compressed file (02000000)
		$val += (($perms & 0x100000) ? 0x100000 : 0x0000);	// sparse file (04000000)
		$val += (($perms & 0x0800) ? 0x0800 : 0x0000);		// Hidden file (setuid bit) (04000)
		$val += (($perms & 0x0400) ? 0x0400 : 0x0000);		// System file (setgid bit) (02000)
		$val += (($perms & 0x0200) ? 0x0200 : 0x0000);		// Archive bit (sticky bit) (01000)

		return decoct($val);
	}

	/**
	 * Return infos concerning the entity
	 * @param string $path
	 * @param boolean $withroot
	 * @param boolean $content
	 * @param boolean $byline
	 * @param int $length
	 * @return array
	 */
	public function infos($path = null, $withroot = true, $content = true, $byline = false, $length = 1024)
	{
		$this->test_var($path, $this->path);

		if (is_dir($path))
		{
			if ($handle = opendir($path))
			{
				$infos['type']			= 'dir';
				$infos['path_infos']	= pathinfo($path);
				$infos['atime']			= fileatime($path);
				$infos['ctime']			= filectime($path);
				$infos['mtime']			= filemtime($path);
				$infos['chmod']			= $this->mod($path);
				$infos['owner_id']		= fileowner($path);
				$infos['owner_infos']	= posix_getpwuid($infos['owner_id']);
				$infos['group_id']		= filegroup($path);
				$infos['group_infos']	= posix_getgrgid($infos['group_id']);
				$infos['dir_count']		= 0;
				$infos['files_count']	= 0;
				$infos['size']			= $this->filesize($path);
				$infos['files']			= array();
				$infos['directories']	= array();

				while (false !== ($file = readdir($handle)))
				{
					if (is_dir($path.'/'.$file))
					{
						if ($file != '..' && $file != '.' && $file != '')
						{
							$infos['dir_count']++;
							if ($withroot)
								$infos['directories'][] = $path.'/'.$file;
							else
								$infos['directories'][] = $file;
						}
					}
					else if (is_file($path.'/'.$file))
					{
						$infos['files_count']++;

						if ($withroot)
							$infos['files'][] = $path.'/'.$file;
						else
							$infos['files'][] = $file;
					}
				}

				$infos['files']			= array_map(array($this, 'format_path'), $infos['files']);
				$infos['directories']	= array_map(array($this, 'format_path'), $infos['directories']);

				$this->sort_results($infos['directories']);
				$this->sort_results($infos['files']);

				closedir($handle);

				return $infos;
			}
			else
			{
				return false;
			}
		}
		else if (is_file($path))
		{
			if ($handle = fopen($path, 'r'))
			{
				$infos['type']			= 'file';
				$infos['path_infos']	= pathinfo($path);
				$infos['atime']			= fileatime($path);
				$infos['ctime']			= filectime($path);
				$infos['mtime']			= filemtime($path);
				$infos['chmod']			= $this->mod($path);
				$infos['owner_id']		= fileowner($path);
				$infos['owner_infos']	= posix_getpwuid($infos['owner_id']);
				$infos['group_id']		= filegroup($path);
				$infos['group_infos']	= posix_getgrgid($infos['group_id']);
				$infos['lines_count']	= 0;
				$infos['size']			= $this->filesize($path);
				$infos['md5']			= md5_file($path);
				$infos['sha1']			= sha1_file($path);

				if ($content)
					$infos['content']		= $byline === true ? array() : file_get_contents($path);

				while (!feof($handle))
				{
					if ($byline && $content)
						$infos['content'][] = fgets($handle, $length);
					else
						fgets($handle, $length);

					$infos['lines_count']++;
				}

				fclose($handle);

				return $infos;
			}
			else
			{
				return false;
			}
		}
		else
		{
			return false;
		}
	}

	/**
	 * Return tree of a directory
	 * @param string $path
	 * @param boolean $expand2files
	 * @return array
	 */
	public function tree($path = null, $expand2files = true)
	{
		$this->test_var($path, $this->path);

		$directories = $this->lsd($path);

		for ($x = 0; $x < count($directories); $x++)
		{
			if (!is_dir($directories[$x]))
				continue;

			if ($handle = opendir($directories[$x]))
			{
				while (false !== ($file = readdir($handle)))
				{
					if (is_dir($directories[$x]."/".$file))
					{
						if ($file != '..' && $file != '.' && $file != '')
						{
							$directories[] = $directories[$x]."/".$file;
						}
					}
				}
				closedir($handle);
			}
			else
			{
				$directories[] = false;
			}
		}

		$directories[]	= $path;
		$directories	= array_map(array($this, 'format_path'), $directories);

		if ($expand2files)
		{
			foreach ($directories as $dir)
			{
				$expanded_directories[] = $dir;

				if ($handle = opendir($dir))
				{
					while (false !== ($file = readdir($handle)))
						if (is_file($dir.'/'.$file))
							$expanded_directories[] = $dir.'/'.$file;
				}
				else
				{
					$expanded_directories[] = false;
				}
			}

			$expanded_directories = array_map(array($this, 'format_path'), $expanded_directories);

			$this->sort_results($expanded_directories);
		}
		else
		{
			$this->sort_results($directories);
		}

		return $expand2files === true ? $expanded_directories : $directories;
	}

	/**
	 * Return the size of an entity
	 * @param string $path
	 * @return int
	 */
	public function filesize($path = null)
	{
		$this->test_var($path, $this->path);

		if (is_file($path))
			return filesize($path);
		else
		{
			$tree = $this->tree($path);
			$size = 0;

			foreach ($tree as $file)
				if (is_file($file))
					$size += filesize($file);

			return $size;
		}
	}

	/**
	 * Serialize and creates a file with the serial
	 * @param anything $var
	 * @param string $path
	 * @return boolean
	 */
	public function serialize($var, $path = null)
	{
		$this->test_var($path, $this->path);

		if($this->mkfile(serialize($var), $path))
			return true;
		else
			return false;
	}

	/**
	 * Unserialize a file
	 * @param string $path
	 * @return array
	 */
	public function unserialize($path = null)
	{
		$this->test_var($path, $this->path);

		if(is_file($path))
			return unserialize($this->read_file($path));
		else
			return false;
	}

	/**
	 * Parse a ini file
	 * @param string $path
	 * @return array
	 */
	public function parse_ini($path = null, $whithsection = true)
	{
		$this->test_var($path, $this->path);

		if(is_file($path))
			return parse_ini_file($path, $whithsection);
		else
			return false;
	}

	/**
	 * Make ini file
	 * @param array $content
	 * @param string $path
	 * @return boolean
	 */
	public function mkini($content, $path = null)
	{
		$this->test_var($path, $this->path);

		$out = '';

		if (!is_array($content))
			return false;

		foreach ($content as $key => $ini)
		{
			if (is_array($ini))
			{
				$out .= "\n[".$key."]\n\n";

				foreach ($ini as $var => $value)
				{
					$out .= $var." \t\t= ".$this->quote_ini($value)."\n";
				}
			}
			else
			{
				$out .= $key." \t\t= ".$this->quote_ini($ini)."\n";
			}
		}

		return $this->mkfile($out, $path);
	}

	/* Private section
	------------------------------------------------- */

	/**
	 * Set a variable to $default parameter if it's null
	 * @param anything $var
	 * @param anything $default
	 */
	private function test_var(&$var, $default)
	{
		if (is_null($var) || strlen(trim($var)) === 0)
			$var = $default;
	}

	/**
	 * Replace '//' by '/' in paths
	 * @param string $path
	 * @return string
	 */
	private function format_path($path)
	{
		return preg_replace('#\/{2,}#', '/', $path);
	}

	/**
	 * Quote ini var if needed
	 * @param anything $var
	 * @return anything
	 */
	private function quote_ini($var)
	{
		return is_string($var) === true ? '"'.str_replace('"', '\"', $var).'"' : $var;
	}

	/**
	 * Sort results
	 * @param array $array
	 * @return array
	 */
	private function sort_results(&$array)
	{
		if (is_array($array))
			array_multisort(array_map('strtolower', $array), SORT_STRING, SORT_ASC, $array);
	}
}

