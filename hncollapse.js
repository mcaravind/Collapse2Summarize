$(function()
{
	function getIndent(comment)
	{
		if (comment.length == 0) return -1;
		return parseInt(comment.find('td>table>tbody>tr>td:eq(0)>img').attr('width') , 10);
	}
	
	// comments page
	var commentRowIndex = 2;

	// Sometimes Hacker News adds a black line of mourning when someone
	// important for the HN community passes away. This breaks the selector
	// so we need to check if it's in place.
	if ($('body>center>table>tbody>tr:eq(0)>td').attr('bgcolor') === '#000000')
	{
		commentRowIndex = 3;
	}

	var selector = $('body>center>table>tbody>tr:eq(' + commentRowIndex +
		')>td>table:eq(1)>tbody>tr>td>table>tbody>tr>td.default>div>span.comhead');
	
	// if the comments page selector doesn't work,let's check if the threads page selector works
	if (selector.length == 0)
		selector = $('body>center>table>tbody>tr>td>table>tbody>tr>td.default>div>span.comhead');

	selector
		.each(function(idx, val)
		{
			var _this = $(this);
			var button = 
				$('<a></a>')
				.attr('href', '#')
				.text('[-]');
			
			var isCollapsed = false;
			var isDeleted = false;
			var collapsedComments = null;	
			
			button.click(function()
			{
				if (isCollapsed)
				{
					for (var i = 0; i < collapsedComments.length; i++)
					{
						collapsedComments[i].show();
					}
					button.text('[-]');
					isCollapsed = false;
				}
				else {
				    getSummary();
					if (collapsedComments == null)
					{
						var thisComment = _this.parent().parent().parent().parent().parent().parent().parent();
						var thisIndent = getIndent(thisComment);
						collapsedComments = [_this.parent().parent().children('span.comment')];
						if (collapsedComments[0].next('p').length == 1)
						{
							collapsedComments.push(collapsedComments[0].next('p'));
						}
						
						var cursor = thisComment;
						while (getIndent(cursor = cursor.next()) > thisIndent)
						{
							collapsedComments.push(cursor);
							var next = cursor.next('p');
							if (next.length == 1) collapsedComments.push(next);
						}
					}
					for (var i = 0; i < collapsedComments.length; i++)
					{
						collapsedComments[i].hide();
					}
					button.text('[+]');
					if (isDeleted)
					{
						_this.parent().next().show();
					}

					isCollapsed = true;
				}
				
				return false;
			});
			
			// test for deleted comments
			if (_this.parent().next('br').length === 1)
			{
				_this.append(' | ');
				_this.append(button);
			}
			else
			{
				isDeleted = true;
				button.css('color', '#828282').css('text-decoration', 'none').css('font-size', '9pt');
				_this.parent().next().append($('<span></span>').text(' '));
				_this.parent().next().after(button);
			}
		});
});